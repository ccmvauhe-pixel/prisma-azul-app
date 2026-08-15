/**
 * Estado persistente de la app.
 *
 * Las llaves replican las del prototipo (`pa_*`, que allí vivían en localStorage)
 * para que la migración sea uno a uno; aquí se guardan en AsyncStorage.
 * Un único objeto se hidrata al arrancar y se expone con `useSyncExternalStore`,
 * de modo que cualquier pantalla ve los cambios al instante.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import type { PosKey } from '@/data/cruz';

/** Duraciones de cada lectura. Todas semanales desde el cambio de ritmo. */
export const DIA_MS = 86_400_000;
export const SEMANA_MS = 7 * DIA_MS;
export const MES_MS = 30 * DIA_MS;

/**
 * Cruz de Vida: ritmo semanal.
 *
 * Una lectura gratis cada semana y hasta dos adicionales, con un tope duro de
 * tres por semana. El tope existe para que la Cruz siga siendo un acto medido:
 * si se pudieran encadenar lecturas sin límite dejaría de tener peso, y además
 * invitaría a repetir la misma pregunta hasta obtener la respuesta deseada.
 *
 * Hoy no hay forma de conseguir esas dos adicionales dentro de la app: el
 * contador existe, pero se queda en cero. El día que haya cobros, ese es el
 * único punto que hay que alimentar.
 */
export const CRUZ_GRATIS_SEMANA = 1;
export const CRUZ_MAX_SEMANA = 3;

export type AfirmacionLast = {
  cat: string;
  idx: number;
  texto: string;
  nombre: string;
  fecha: number;
};

export type OraculoLast = { key: string; ids: number[]; fecha: number };

export type CodigoActivo = { cat: string; idx: number; unlockAt: number };

export type CruzLast = {
  pregunta: string;
  pos: string;
  posKey: PosKey;
  carta: string;
  texto: string;
  fecha: number;
};

/** Entradas que el usuario decidió conservar; se ven siempre en Mi Camino. */
export type GuardadoAfirmacion = {
  tipo: 'afirmacion';
  fecha: number;
  texto: string;
  categoria: string;
};
export type GuardadoOraculo = {
  tipo: 'oraculo';
  fecha: number;
  oraculo: string;
  ids: number[];
  /**
   * El oráculo guardado vive solo mientras dure su temporizador: al llegar a 0
   * se descarta, se haya guardado uno nuevo o no.
   */
  expira: number;
};
export type GuardadoCodigo = {
  tipo: 'codigo';
  fecha: number;
  numero: string;
  proposito: string;
  categoria: string;
};
export type GuardadoCruz = { tipo: 'cruz'; fecha: number } & Omit<CruzLast, 'fecha'>;

export type Guardado =
  | GuardadoAfirmacion
  | GuardadoOraculo
  | GuardadoCodigo
  | GuardadoCruz;

export type State = {
  /** Día de mayor vibración: se sortea una vez por semana, con el lunes como llave */
  vibra: { week: string; idx: number } | null;

  afirmacionLock: number;
  afirmacionLast: AfirmacionLast | null;

  oraculoLock: number;
  oraculoLast: OraculoLast | null;

  codigoActivo: CodigoActivo | null;

  cruzLast: CruzLast | null;
  /** Timestamp de la próxima lectura gratis */
  cruzNext: number;
  /**
   * Consumo de la semana en curso. `wk` es la llave del lunes (ver `semanaKey`),
   * así que al cambiar de semana el contador se ignora y vuelve a empezar solo,
   * sin necesidad de una tarea que lo reinicie.
   */
  cruzSemana: { wk: string; usadas: number } | null;
  /**
   * Lecturas adicionales disponibles y sin usar.
   *
   * No caducan al terminar la semana: una vez concedida, se conserva hasta
   * gastarla. Lo que sí aplica siempre es el tope de `CRUZ_MAX_SEMANA`.
   *
   * En la versión gratuita siempre vale cero — nada la incrementa todavía.
   */
  cruzExtras: number;

  /** Historial de lo que el usuario eligió guardar (máx. 60, más reciente primero) */
  guardados: Guardado[];

  /** Preferencias de aviso por lectura */
  notif: { afirmacion: boolean; codigo: boolean; oraculo: boolean; cruz: boolean };
};

const EMPTY: State = {
  vibra: null,
  afirmacionLock: 0,
  afirmacionLast: null,
  oraculoLock: 0,
  oraculoLast: null,
  codigoActivo: null,
  cruzLast: null,
  cruzNext: 0,
  cruzSemana: null,
  cruzExtras: 0,
  guardados: [],
  notif: { afirmacion: true, codigo: true, oraculo: true, cruz: true },
};

const STORAGE_KEY = 'pa_state_v2';
/** Versión anterior, para migrar lo que ya hubiera guardado el usuario. */
const STORAGE_KEY_V1 = 'pa_state_v1';
const MAX_GUARDADOS = 60;

/**
 * Tipos de los que solo se conserva la entrega más reciente: al guardar una
 * nueva, la anterior se descarta.
 *
 * Están los cuatro: ninguna sección acumula historial. Lo guardado es siempre
 * "lo último", y lo anterior desaparece en cuanto llega un reemplazo.
 */
const SOLO_ULTIMO: Guardado['tipo'][] = ['oraculo', 'cruz', 'afirmacion', 'codigo'];

let state: State = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Escucha los cambios del estado desde fuera de React.
 *
 * Lo usa la sincronización con Supabase para enterarse de cuándo hay algo que
 * subir. Devuelve la función para dejar de escuchar.
 */
export function suscribir(listener: () => void): () => void {
  return subscribe(listener);
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Si el almacenamiento falla la app sigue usable en memoria durante la sesión.
  }
}

/**
 * Migración del ritmo mensual al semanal.
 *
 * El estado viejo llevaba `cruzMes: { ym, usadas }` y un `cruzNext` a treinta
 * días vista. Ese cupo ya no significa nada bajo las reglas nuevas, así que en
 * vez de intentar convertirlo se descarta y la persona entra a la semana en
 * curso con su lectura gratis disponible.
 *
 * Se resuelve a favor del usuario a propósito: cambiamos las reglas a mitad de
 * partida, y dejar a alguien esperando por un contador de un sistema que ya no
 * existe sería castigarlo por una decisión nuestra.
 */
type EstadoLegado = Partial<State> & { cruzMes?: { ym: string; usadas: number } | null };

function migrarACruzSemanal(cargado: EstadoLegado): Partial<State> {
  if (!('cruzMes' in cargado)) return cargado;
  const { cruzMes: _descartado, ...resto } = cargado;
  return { ...resto, cruzSemana: null, cruzExtras: cargado.cruzExtras ?? 0, cruzNext: 0 };
}

/** Carga el estado guardado. Llamar una sola vez, al arrancar la app. */
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...EMPTY, ...migrarACruzSemanal(JSON.parse(raw) as EstadoLegado) };
    } else {
      // Migración desde v1: el Oráculo pasó a conservar solo la última lectura,
      // así que su historial acumulado se descarta una única vez.
      const previo = await AsyncStorage.getItem(STORAGE_KEY_V1);
      if (previo) {
        const v1 = { ...EMPTY, ...migrarACruzSemanal(JSON.parse(previo) as EstadoLegado) };
        state = {
          ...v1,
          guardados: v1.guardados.filter((g) => g.tipo !== 'oraculo'),
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        await AsyncStorage.removeItem(STORAGE_KEY_V1);
      }
    }
  } catch {
    state = EMPTY;
  }
  // Lo caducado no debe quedar ocupando sitio en el almacenamiento.
  const limpio = purgarCaducados(state, Date.now());
  if (limpio !== state) {
    state = limpio;
    void persist();
  }
  hydrated = true;
  emit();
}

export function getState(): State {
  return state;
}

/** Aplica un cambio parcial, notifica a las pantallas y persiste. */
export function setState(patch: Partial<State> | ((s: State) => Partial<State>)): void {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  emit();
  void persist();
}

export function useStore(): State {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => hydrated,
  );
}

/**
 * Añade una entrada al historial.
 *
 * Guardar es lo que hace que algo sobreviva: lo que no se guarda no vuelve a
 * verse, ni siquiera durante el periodo activo de su temporizador.
 *
 * Los tipos listados en `SOLO_ULTIMO` no se acumulan: la nueva entrada sustituye
 * a las anteriores de ese tipo.
 */
export function guardar(entrada: Guardado): void {
  setState((s) => {
    const previas = SOLO_ULTIMO.includes(entrada.tipo)
      ? s.guardados.filter((g) => g.tipo !== entrada.tipo)
      : s.guardados;
    return { guardados: [entrada, ...previas].slice(0, MAX_GUARDADOS) };
  });
}

/** Borra todo lo guardado de un tipo. Lo usan los "Restablecer (demo)". */
export function borrarGuardadosDe(tipo: Guardado['tipo']): void {
  setState((s) => ({ guardados: s.guardados.filter((g) => g.tipo !== tipo) }));
}

/** ¿Sigue vigente esta entrada? Solo caducan las que declaran `expira`. */
function vigente(g: Guardado, ahora: number): boolean {
  return !('expira' in g) || g.expira > ahora;
}

/**
 * Entradas guardadas de un tipo, de la más reciente a la más antigua.
 *
 * Se descartan las caducadas: el oráculo guardado desaparece cuando su
 * temporizador llega a 0, aunque no se haya guardado uno nuevo.
 */
export function guardadosDe<T extends Guardado['tipo']>(
  s: State,
  tipo: T,
  ahora: number = Date.now(),
): Extract<Guardado, { tipo: T }>[] {
  return s.guardados.filter(
    (g): g is Extract<Guardado, { tipo: T }> => g.tipo === tipo && vigente(g, ahora),
  );
}

/** Borra de verdad lo que ya caducó. Se llama al arrancar. */
function purgarCaducados(s: State, ahora: number): State {
  const vivos = s.guardados.filter((g) => vigente(g, ahora));
  return vivos.length === s.guardados.length ? s : { ...s, guardados: vivos };
}

/** La entrada guardada más reciente de un tipo, o `null` si no hay ninguna. */
export function ultimoGuardado<T extends Guardado['tipo']>(
  s: State,
  tipo: T,
): Extract<Guardado, { tipo: T }> | null {
  return guardadosDe(s, tipo)[0] ?? null;
}

/** ¿Ya se guardó la entrega en curso? Compara contra el sello de tiempo de la lectura. */
export function guardadoDesde(s: State, tipo: Guardado['tipo'], desde: number): boolean {
  return s.guardados.some((g) => g.tipo === tipo && g.fecha >= desde);
}

/**
 * Deja la app como recién estrenada: todos los temporizadores a 0, todas las
 * secciones disponibles y **nada guardado**.
 *
 * Antes conservaba el historial; ahora no, para que el demo arranque siempre
 * desde cero y cada sección vuelva a pedir que entres a hacer tu lectura.
 */
/**
 * Cómo está la Cruz ahora mismo.
 *
 * Toda la regla vive aquí y no repartida entre pantallas: la Cruz es lo único
 * que se cobra, así que si `index` y `cruz` calcularan la disponibilidad por su
 * cuenta, una discrepancia entre ambas sería una lectura regalada o una lectura
 * cobrada dos veces.
 */
export type EstadoCruz = {
  /** Lecturas hechas en la semana en curso */
  usadas: number;
  /** ¿Queda la gratis de esta semana? */
  gratisDisponible: boolean;
  /** Extras compradas sin gastar */
  extras: number;
  /** ¿Se puede leer ahora, sea gratis o gastando una extra? */
  puedeLeer: boolean;
  /** Si lee ahora, ¿consumiría una extra? */
  consumeExtra: boolean;
  /** Cuántas más caben esta semana antes del tope */
  cupoRestante: number;
};

export function estadoCruz(s: State, ahora = Date.now()): EstadoCruz {
  const usadas = s.cruzSemana?.wk === semanaKey() ? s.cruzSemana.usadas : 0;
  const cupoRestante = Math.max(0, CRUZ_MAX_SEMANA - usadas);
  // La gratis pide dos cosas: no haberla gastado esta semana y que el
  // temporizador haya vencido. El temporizador sobrevive a la reinstalación
  // porque se sincroniza; el contador semanal, por sí solo, no bastaría.
  const gratisDisponible =
    usadas < CRUZ_GRATIS_SEMANA && s.cruzNext <= ahora && cupoRestante > 0;
  const extras = Math.max(0, s.cruzExtras);
  const puedeConExtra = !gratisDisponible && extras > 0 && cupoRestante > 0;

  return {
    usadas,
    gratisDisponible,
    extras,
    puedeLeer: gratisDisponible || puedeConExtra,
    consumeExtra: puedeConExtra,
    cupoRestante,
  };
}

/**
 * Aplica el consumo de una lectura de la Cruz.
 *
 * Devuelve el parche para `setState`. Descuenta la extra solo si la gratis no
 * estaba disponible, y mueve el temporizador únicamente cuando se gastó la
 * gratis: gastar una adicional no debe adelantar la siguiente semana.
 */
export function consumirCruz(s: State, ahora = Date.now()): Partial<State> {
  const e = estadoCruz(s, ahora);
  const wk = semanaKey();
  const patch: Partial<State> = {
    cruzSemana: { wk, usadas: e.usadas + 1 },
  };
  if (e.consumeExtra) patch.cruzExtras = Math.max(0, s.cruzExtras - 1);
  else patch.cruzNext = ahora + SEMANA_MS;
  return patch;
}

export function restablecerLecturas(): void {
  setState({
    vibra: null,
    afirmacionLock: 0,
    afirmacionLast: null,
    oraculoLock: 0,
    oraculoLast: null,
    codigoActivo: null,
    cruzLast: null,
    cruzNext: 0,
    cruzSemana: null,
    // Las extras compradas NO se tocan: son dinero pagado, no estado de demo.
    guardados: [],
  });
}

/** 'YYYY-M' del mes en curso. Ya no lo usa la Cruz; se conserva por si algo lo pide. */
export function mesKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

/** Fecha del lunes de la semana en curso, como llave del día de vibración. */
export function semanaKey(d: Date = new Date()): string {
  const mon = new Date(d);
  mon.setHours(0, 0, 0, 0);
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  return `${mon.getFullYear()}-${mon.getMonth() + 1}-${mon.getDate()}`;
}
