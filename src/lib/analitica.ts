/**
 * Analítica de uso.
 *
 * Para qué: saber qué secciones se usan de verdad, y con eso decidir cuáles
 * crecen, cuáles se afinan y cuáles sobran. Se cruza con lo que cada persona
 * dijo querer manifestar en el onboarding, para ver si lo que buscan coincide
 * con lo que acaban usando.
 *
 * Tres reglas que gobiernan este archivo:
 *
 *  1. **Nunca estorba.** Registrar es disparar y olvidar: no se espera, no se
 *     bloquea un render y un fallo de red jamás rompe una pantalla.
 *  2. **Nunca guarda contenido personal.** Se apunta *qué* se hizo, no el texto
 *     de la lectura ni la respuesta del oráculo. Qué carta salió, sí; qué decía,
 *     no — eso ya vive en el contenido y no hace falta duplicarlo.
 *  3. **No se puede reescribir.** RLS solo permite insertar y leer lo propio.
 *     Un registro que el cliente pudiera editar no serviría para decidir nada.
 */
import { getSesion } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export type TipoEvento =
  | 'seccion_abierta'
  | 'ritual_completado'
  | 'guardado'
  | 'contenido';

export type Seccion =
  | 'cruz'
  | 'oraculo'
  | 'codigos'
  | 'afirmaciones'
  | 'baraja'
  | 'perfil'
  | 'inicio';

type Evento = {
  user_id: string;
  tipo: TipoEvento;
  seccion: Seccion | null;
  detalle: Record<string, unknown>;
};

/** Se acumulan y se mandan en tandas: una petición por evento sería absurdo. */
const cola: Evento[] = [];
const RETARDO = 4000;
const MAX_COLA = 40;

let temporizador: ReturnType<typeof setTimeout> | null = null;
let enviando = false;

/**
 * Apunta un evento. No devuelve nada y no lanza: quien la llama no debe tener
 * que preocuparse de si funcionó.
 */
export function registrar(
  tipo: TipoEvento,
  seccion: Seccion | null = null,
  detalle: Record<string, unknown> = {},
): void {
  const sesion = getSesion();
  if (!supabase || !sesion) return;

  cola.push({ user_id: sesion.user.id, tipo, seccion, detalle });

  // Si se desborda se tiran los más viejos: perder analítica es aceptable,
  // comerse la memoria del teléfono no.
  if (cola.length > MAX_COLA) cola.splice(0, cola.length - MAX_COLA);

  if (!temporizador) {
    temporizador = setTimeout(() => {
      temporizador = null;
      void vaciar();
    }, RETARDO);
  }
}

async function vaciar(): Promise<void> {
  if (!supabase || enviando || cola.length === 0) return;
  const sesion = getSesion();
  if (!sesion) {
    cola.length = 0;
    return;
  }

  enviando = true;
  const tanda = cola.splice(0, cola.length);
  try {
    const { error } = await supabase.from('eventos').insert(tanda);
    /*
     * Si falla se devuelven a la cola para el próximo intento, salvo que el
     * rechazo no se vaya a arreglar repitiéndolo:
     *
     *  42501 — permisos (RLS).
     *  23514 — el tope por hora de `003-limite-eventos.sql`, o alguna de las
     *          restricciones CHECK de `eventos`. Reintentar aquí sería lo peor
     *          posible: la tanda vuelve a la cola, se reenvía, la vuelven a
     *          rechazar, y la app se queda machacando el servidor justo cuando
     *          el servidor está pidiendo que pare.
     *
     * Perder analítica es aceptable; ese bucle no.
     */
    if (error && error.code !== '42501' && error.code !== '23514') {
      cola.unshift(...tanda);
    }
  } catch {
    cola.unshift(...tanda);
  } finally {
    enviando = false;
  }
}

/** Manda lo pendiente sin esperar. Para antes de cerrar sesión. */
export async function vaciarAhora(): Promise<void> {
  if (temporizador) {
    clearTimeout(temporizador);
    temporizador = null;
  }
  await vaciar();
}

// — Atajos, para que las pantallas lean bien —

export const abrioSeccion = (s: Seccion) => registrar('seccion_abierta', s);

export const completoLectura = (s: Seccion, detalle: Record<string, unknown> = {}) =>
  registrar('ritual_completado', s, detalle);

export const guardo = (s: Seccion, detalle: Record<string, unknown> = {}) =>
  registrar('guardado', s, detalle);

/** Qué contenido concreto le tocó: carta, código, pregunta. Sin textos. */
export const vioContenido = (s: Seccion, detalle: Record<string, unknown>) =>
  registrar('contenido', s, detalle);
