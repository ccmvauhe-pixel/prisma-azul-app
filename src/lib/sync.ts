/**
 * Sincronización de los datos de usuario con Supabase.
 *
 * La app sigue siendo local-first y esto no lo cambia: `store.ts` manda, las
 * pantallas leen de memoria y nada de aquí bloquea un render. Si no hay red, o
 * no hay sesión, o no hay backend, todo funciona igual — solo que sin viajar.
 *
 * Ciclo: al entrar se **baja** lo remoto y se funde con lo local; a partir de
 * ahí, cada cambio del store se **sube** con retardo para no escribir en cada
 * pulsación.
 *
 * ── La regla de fusión ──────────────────────────────────────────────────────
 * Gana lo más restrictivo, no lo más reciente.
 *
 * Suena raro hasta que se ve el caso que evita: si ganara lo más reciente,
 * bastaría reinstalar la app para que el estado local en blanco pisara los
 * temporizadores del servidor y regalara una lectura de Cruz cada vez. Tomando
 * siempre el bloqueo mayor y el contador más alto, reinstalar no da nada.
 *
 * Para lo guardado sí manda la fecha: ahí no hay nada que hacer trampa.
 */
import {
  getState,
  setState,
  suscribir,
  type Guardado,
  type State,
} from '@/lib/store';
import { getSesion } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/** Espera antes de subir, para agrupar ráfagas de cambios. */
const RETARDO_SUBIDA = 1500;

let temporizador: ReturnType<typeof setTimeout> | null = null;
let subiendo = false;
let bajado = false;
let pendiente = false;

// — Conversión entre el estado de la app y las filas de la base —

type FilaEstado = {
  user_id: string;
  vibra_semana: string | null;
  vibra_idx: number | null;
  afirmacion_lock: string | null;
  oraculo_lock: string | null;
  codigo_categoria: string | null;
  codigo_idx: number | null;
  codigo_unlock_at: string | null;
  cruz_next: string | null;
  cruz_semana_wk: string | null;
  cruz_semana_usadas: number;
  /**
   * Solo de lectura para el cliente: se recibe pero nunca se envía. Quien la
   * escribe es el servidor al validar un pago.
   */
  cruz_extras?: number;
  notif: State['notif'];
};

type FilaGuardado = {
  user_id: string;
  tipo: Guardado['tipo'];
  fecha: string;
  expira: string | null;
  datos: Record<string, unknown>;
};

/** `null` cuando el instante es 0, que en el store significa "sin bloqueo". */
const aIso = (ms: number | null | undefined): string | null =>
  ms ? new Date(ms).toISOString() : null;

const aMs = (iso: string | null | undefined): number =>
  iso ? new Date(iso).getTime() : 0;

function estadoAFila(s: State, userId: string): FilaEstado {
  return {
    user_id: userId,
    vibra_semana: s.vibra?.week ?? null,
    vibra_idx: s.vibra?.idx ?? null,
    afirmacion_lock: aIso(s.afirmacionLock),
    oraculo_lock: aIso(s.oraculoLock),
    codigo_categoria: s.codigoActivo?.cat ?? null,
    codigo_idx: s.codigoActivo?.idx ?? null,
    codigo_unlock_at: aIso(s.codigoActivo?.unlockAt),
    cruz_next: aIso(s.cruzNext),
    cruz_semana_wk: s.cruzSemana?.wk ?? null,
    cruz_semana_usadas: s.cruzSemana?.usadas ?? 0,
    // Las extras NO se suben: el servidor es su única fuente de verdad. Si el
    // cliente pudiera escribirlas, cualquiera se regalaría lecturas de pago
    // editando el almacenamiento local.
    notif: s.notif,
  };
}

/**
 * Funde la fila remota con el estado local quedándose con lo más restrictivo.
 * Devuelve solo lo que cambia, o `null` si no cambia nada.
 */
function fundirEstado(local: State, remoto: FilaEstado): Partial<State> | null {
  const cambios: Partial<State> = {};

  const afirm = Math.max(local.afirmacionLock, aMs(remoto.afirmacion_lock));
  if (afirm !== local.afirmacionLock) cambios.afirmacionLock = afirm;

  const oraculo = Math.max(local.oraculoLock, aMs(remoto.oraculo_lock));
  if (oraculo !== local.oraculoLock) cambios.oraculoLock = oraculo;

  const cruzNext = Math.max(local.cruzNext, aMs(remoto.cruz_next));
  if (cruzNext !== local.cruzNext) cambios.cruzNext = cruzNext;

  // Código activo: se conserva el que bloquee hasta más tarde.
  const unlockRemoto = aMs(remoto.codigo_unlock_at);
  const unlockLocal = local.codigoActivo?.unlockAt ?? 0;
  if (unlockRemoto > unlockLocal && remoto.codigo_categoria && remoto.codigo_idx !== null) {
    cambios.codigoActivo = {
      cat: remoto.codigo_categoria,
      idx: remoto.codigo_idx,
      unlockAt: unlockRemoto,
    };
  }

  // Consumo semanal de la Cruz: dentro de la misma semana, el contador más alto.
  if (remoto.cruz_semana_wk) {
    const mismaSemana = local.cruzSemana?.wk === remoto.cruz_semana_wk;
    const usadas = mismaSemana
      ? Math.max(local.cruzSemana?.usadas ?? 0, remoto.cruz_semana_usadas)
      : remoto.cruz_semana_usadas;
    // Una semana remota distinta solo se adopta si la local no existe.
    if (mismaSemana || !local.cruzSemana) {
      if (
        local.cruzSemana?.usadas !== usadas ||
        local.cruzSemana?.wk !== remoto.cruz_semana_wk
      ) {
        cambios.cruzSemana = { wk: remoto.cruz_semana_wk, usadas };
      }
    }
  }

  /*
   * Las extras vienen SIEMPRE del servidor, tal cual, sin la regla de "gana lo
   * más restrictivo" que gobierna los temporizadores.
   *
   * Esa regla existe para que reinstalar la app no regale lecturas; aquí sería
   * contraproducente: el servidor es quien sabe cuántas se pagaron y cuántas se
   * gastaron, y el valor local es solo una copia para poder pintar la pantalla
   * sin esperar a la red.
   */
  if (typeof remoto.cruz_extras === 'number' && remoto.cruz_extras !== local.cruzExtras) {
    cambios.cruzExtras = Math.max(0, remoto.cruz_extras);
  }

  // El día de vibración es cosmético: se adopta el remoto si es de esta semana
  // y aquí todavía no hay ninguno.
  if (!local.vibra && remoto.vibra_semana && remoto.vibra_idx !== null) {
    cambios.vibra = { week: remoto.vibra_semana, idx: remoto.vibra_idx };
  }

  return Object.keys(cambios).length ? cambios : null;
}

function guardadoAFila(g: Guardado, userId: string): FilaGuardado {
  const { tipo, fecha, ...resto } = g as Guardado & { expira?: number };
  return {
    user_id: userId,
    tipo,
    fecha: new Date(fecha).toISOString(),
    expira: 'expira' in g && g.expira ? new Date(g.expira).toISOString() : null,
    datos: resto as Record<string, unknown>,
  };
}

/**
 * Reconstruye una entrada guardada a partir de su fila. Devuelve `null` si la
 * fila no tiene la forma esperada.
 *
 * El `...(f.datos)` de abajo esparce lo que venga dentro del objeto, así que un
 * `datos` que no sea un objeto —un array, un número, una cadena— se cuela en el
 * estado de la app como índices numéricos o caracteres sueltos. Es la propia
 * cuenta, no la de nadie más, pero rompe pantallas y sobrevive al reinicio.
 *
 * `004-cuentas-y-validacion.sql` ya impide escribir eso (`jsonb_typeof(datos) =
 * 'object'`). Esto es la otra mitad: lo que ya estuviera guardado de antes no
 * lo arregla ninguna restricción, porque las CHECK entraron como `not valid`.
 *
 * Mismo criterio que `contenido.ts`: ante la duda, se descarta la pieza en vez
 * de propagar algo con una forma que no cuadra.
 */
function filaAGuardado(f: FilaGuardado): Guardado | null {
  if (!f.datos || typeof f.datos !== 'object' || Array.isArray(f.datos)) return null;

  const fecha = new Date(f.fecha).getTime();
  // Una fecha inválida es NaN, y NaN pierde todas las comparaciones de
  // `fundirGuardados`: la entrada nunca ganaría, pero sí ocuparía su tipo.
  if (Number.isNaN(fecha)) return null;

  return {
    ...(f.datos as object),
    tipo: f.tipo,
    fecha,
    ...(f.expira ? { expira: new Date(f.expira).getTime() } : {}),
  } as Guardado;
}

/**
 * Funde lo guardado: por cada tipo sobrevive la entrada más reciente.
 *
 * Aquí sí manda la fecha, no lo restrictivo: si guardaste una lectura en otro
 * teléfono, esa es la buena.
 */
function fundirGuardados(locales: Guardado[], remotos: Guardado[]): Guardado[] {
  const porTipo = new Map<string, Guardado>();
  for (const g of [...locales, ...remotos]) {
    const previo = porTipo.get(g.tipo);
    if (!previo || g.fecha > previo.fecha) porTipo.set(g.tipo, g);
  }
  return [...porTipo.values()].sort((a, b) => b.fecha - a.fecha);
}

// — Bajada —

/** Trae lo remoto y lo funde con lo local. Se llama al entrar la sesión. */
export async function bajar(): Promise<void> {
  const sesion = getSesion();
  if (!supabase || !sesion) return;
  const userId = sesion.user.id;

  try {
    const [estado, guardados] = await Promise.all([
      supabase.from('estado_rituales').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('guardados').select('*').eq('user_id', userId),
    ]);

    const local = getState();
    const cambios: Partial<State> = {};

    if (estado.data) {
      const fundido = fundirEstado(local, estado.data as FilaEstado);
      if (fundido) Object.assign(cambios, fundido);
    }

    if (guardados.data?.length) {
      const remotos = (guardados.data as FilaGuardado[])
        .map(filaAGuardado)
        .filter((g): g is Guardado => g !== null);
      const fundidos = fundirGuardados(local.guardados, remotos);
      // Solo se toca el store si el resultado difiere, para no disparar un
      // render y una subida en cadena por nada.
      if (JSON.stringify(fundidos) !== JSON.stringify(local.guardados)) {
        cambios.guardados = fundidos;
      }
    }

    if (Object.keys(cambios).length) setState(cambios);
  } catch {
    // Sin red se sigue con lo local; se reintentará al próximo cambio.
  } finally {
    bajado = true;
    // Lo fundido debe volver al servidor para que ambos lados coincidan.
    programarSubida();
  }
}

// — Subida —

async function subir(): Promise<void> {
  const sesion = getSesion();
  if (!supabase || !sesion || subiendo) return;

  subiendo = true;
  const s = getState();
  const userId = sesion.user.id;

  try {
    await supabase.from('estado_rituales').upsert(estadoAFila(s, userId), {
      onConflict: 'user_id',
    });

    if (s.guardados.length) {
      await supabase
        .from('guardados')
        .upsert(
          s.guardados.map((g) => guardadoAFila(g, userId)),
          { onConflict: 'user_id,tipo' },
        );
    }

    // Lo que se borró aquí (restablecer demo) debe borrarse allí.
    const tipos = s.guardados.map((g) => g.tipo);
    let borrado = supabase.from('guardados').delete().eq('user_id', userId);
    if (tipos.length) borrado = borrado.not('tipo', 'in', `(${tipos.join(',')})`);
    await borrado;
  } catch {
    // Se reintenta con el siguiente cambio del store.
  } finally {
    subiendo = false;
    if (pendiente) {
      pendiente = false;
      programarSubida();
    }
  }
}

function programarSubida(): void {
  if (!supabase || !getSesion()) return;
  if (subiendo) {
    pendiente = true;
    return;
  }
  if (temporizador) clearTimeout(temporizador);
  temporizador = setTimeout(() => {
    temporizador = null;
    void subir();
  }, RETARDO_SUBIDA);
}

// — Arranque —

let desuscribir: (() => void) | null = null;

/**
 * Engancha la sincronización al store. Se llama cuando hay sesión.
 * Devuelve la función para soltarla.
 */
export function iniciarSync(): () => void {
  if (!supabase || !getSesion()) return () => {};

  bajado = false;
  void bajar();

  desuscribir?.();
  desuscribir = suscribir(() => {
    // Antes de la primera bajada no se sube: se pisaría lo remoto con un
    // estado local que aún no se ha fundido.
    if (bajado) programarSubida();
  });

  return () => {
    desuscribir?.();
    desuscribir = null;
    if (temporizador) clearTimeout(temporizador);
    temporizador = null;
  };
}

/** Sube ya, sin esperar el retardo. Para cerrar sesión sin perder nada. */
export async function subirAhora(): Promise<void> {
  if (temporizador) {
    clearTimeout(temporizador);
    temporizador = null;
  }
  await subir();
}
