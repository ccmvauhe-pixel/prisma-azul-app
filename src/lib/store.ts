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

/** Duraciones de cada ritual. La Cruz es mensual; Afirmaciones y Códigos, semanales. */
export const DIA_MS = 86_400_000;
export const SEMANA_MS = 7 * DIA_MS;
export const MES_MS = 30 * DIA_MS;

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
  /** Control de la lectura mensual: `ym` = 'YYYY-M' */
  cruzMes: { ym: string; usadas: number } | null;

  /** Historial de lo que el usuario eligió guardar (máx. 60, más reciente primero) */
  guardados: Guardado[];

  /** Preferencias de aviso por ritual */
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
  cruzMes: null,
  guardados: [],
  notif: { afirmacion: true, codigo: true, oraculo: true, cruz: true },
};

const STORAGE_KEY = 'pa_state_v2';
/** Versión anterior, para migrar lo que ya hubiera guardado el usuario. */
const STORAGE_KEY_V1 = 'pa_state_v1';
const MAX_GUARDADOS = 60;

/**
 * Tipos de los que solo se conserva la entrega más reciente: al guardar una
 * nueva, la anterior se descarta. El Oráculo funciona así — cada lectura
 * reemplaza a la anterior en vez de acumularse.
 */
const SOLO_ULTIMO: Guardado['tipo'][] = ['oraculo'];

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

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Si el almacenamiento falla la app sigue usable en memoria durante la sesión.
  }
}

/** Carga el estado guardado. Llamar una sola vez, al arrancar la app. */
export async function hydrate(): Promise<void> {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...EMPTY, ...(JSON.parse(raw) as Partial<State>) };
    } else {
      // Migración desde v1: el Oráculo pasó a conservar solo la última lectura,
      // así que su historial acumulado se descarta una única vez.
      const previo = await AsyncStorage.getItem(STORAGE_KEY_V1);
      if (previo) {
        const v1 = { ...EMPTY, ...(JSON.parse(previo) as Partial<State>) };
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

/** ¿Ya se guardó la entrega en curso? Compara contra el sello de tiempo del ritual. */
export function guardadoDesde(s: State, tipo: Guardado['tipo'], desde: number): boolean {
  return s.guardados.some((g) => g.tipo === tipo && g.fecha >= desde);
}

/** Borra el progreso de los rituales; conserva lo que el usuario guardó. */
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
    cruzMes: null,
  });
}

/** 'YYYY-M' del mes en curso; llave del control mensual de la Cruz. */
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
