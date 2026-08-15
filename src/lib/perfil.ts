/**
 * Perfil de la persona: lo que se recoge en el onboarding y se edita después.
 *
 * Vive en Supabase, pero se cachea en AsyncStorage para que la app abra sin
 * esperar a la red.
 *
 * El correo también vive aquí, y no en `auth.users`, porque hoy las sesiones
 * son anónimas: no hay contraseña ni correos que enviar, así que Supabase no
 * tiene ningún correo que gobernar.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { getSesion } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/** Áreas del cuestionario. El orden es el que se muestra. */
export const INTERESES = [
  { key: 'amor', nombre: 'Amor', sub: 'Sanar, soltar o atraer' },
  { key: 'trabajo', nombre: 'Trabajo', sub: 'Rumbo y oportunidades' },
  { key: 'dinero', nombre: 'Dinero', sub: 'Prosperidad y estabilidad' },
  { key: 'salud', nombre: 'Salud', sub: 'Cuerpo y energía' },
  { key: 'limpieza', nombre: 'Limpieza energética', sub: 'Soltar lo que pesa' },
] as const;

export type InteresKey = (typeof INTERESES)[number]['key'];

export type Perfil = {
  id: string;
  nombre: string | null;
  /**
   * Vive aquí y no en `auth.users` porque las sesiones son anónimas: no hay
   * contraseña ni correos que enviar, así que Supabase no tiene correo que
   * gobernar. Se pide en el onboarding como un dato más.
   */
  correo: string | null;
  fechaNacimiento: string | null; // 'YYYY-MM-DD'
  intereses: InteresKey[];
  interesPrincipal: InteresKey | null;
  tema: 'noche' | 'dia' | 'sistema';
  onboardingCompleto: boolean;
};

const CLAVE_CACHE = 'pa_perfil_v1';

let perfil: Perfil | null = null;
let listo = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function usePerfil(): Perfil | null {
  return useSyncExternalStore(
    subscribe,
    () => perfil,
    () => perfil,
  );
}

/** ¿Ya sabemos si hay perfil? Evita enseñar el onboarding a quien ya lo hizo. */
export function usePerfilListo(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => listo,
    () => listo,
  );
}

export function getPerfil(): Perfil | null {
  return perfil;
}

type Fila = {
  id: string;
  nombre: string | null;
  correo: string | null;
  fecha_nacimiento: string | null;
  intereses: string[] | null;
  interes_principal: string | null;
  tema: string | null;
  onboarding_completo: boolean | null;
};

function deFila(f: Fila): Perfil {
  return {
    id: f.id,
    nombre: f.nombre,
    correo: f.correo,
    fechaNacimiento: f.fecha_nacimiento,
    intereses: (f.intereses ?? []) as InteresKey[],
    interesPrincipal: (f.interes_principal as InteresKey | null) ?? null,
    tema: (f.tema as Perfil['tema']) ?? 'noche',
    onboardingCompleto: f.onboarding_completo ?? false,
  };
}

async function guardarCache(): Promise<void> {
  try {
    if (perfil) await AsyncStorage.setItem(CLAVE_CACHE, JSON.stringify(perfil));
    else await AsyncStorage.removeItem(CLAVE_CACHE);
  } catch {
    // Sin caché la app sigue: se volverá a pedir al servidor.
  }
}

/**
 * Carga el perfil: primero de caché, luego del servidor.
 *
 * Se llama cuando entra la sesión. Devuelve cuando ya se sabe si hay perfil o
 * no, para que la compuerta del onboarding no parpadee.
 */
export async function cargarPerfil(): Promise<void> {
  const sesion = getSesion();
  if (!supabase || !sesion) {
    perfil = null;
    listo = true;
    emit();
    return;
  }

  try {
    const raw = await AsyncStorage.getItem(CLAVE_CACHE);
    if (raw) {
      const guardado = JSON.parse(raw) as Perfil;
      // La caché de otra cuenta no vale.
      if (guardado.id === sesion.user.id) {
        perfil = guardado;
        emit();
      }
    }
  } catch {
    // Caché ilegible: se ignora.
  }

  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', sesion.user.id)
      .maybeSingle();
    if (data) {
      perfil = deFila(data as Fila);
      await guardarCache();
    } else if (!error) {
      /*
       * Hay sesión y el servidor confirma que NO hay fila.
       *
       * No debería pasar — la crea el disparador `crear_perfil` al nacer la
       * cuenta — pero si pasa, dejarlo en `null` es lo peor: `_layout` decide
       * si enseñar el onboarding con `perfil && !perfil.onboardingCompleto`,
       * así que sin fila esa condición es falsa y la compuerta se salta
       * entera, incluida la edad mínima.
       *
       * `004-cuentas-y-validacion.sql` quitó el DELETE de las políticas de
       * `perfiles`, así que el cliente ya no puede provocarlo. Esto repara las
       * cuentas a las que les pasó antes de aplicarlo, y cubre el caso de una
       * cuenta anterior al disparador.
       *
       * El `!error` de la condición es la mitad importante: sin red,
       * `supabase-js` no lanza, devuelve `{ data: null, error }`. Mirando solo
       * `data` no se distingue "el servidor dice que no hay fila" de "no se ha
       * podido preguntar", y se intentaba crear un perfil en cada arranque sin
       * conexión — además de ser la interpretación contraria a la verdad.
       */
      const { data: creada } = await supabase
        .from('perfiles')
        .insert({ id: sesion.user.id })
        .select()
        .maybeSingle();
      if (creada) {
        perfil = deFila(creada as Fila);
        await guardarCache();
      }
    }
  } catch {
    // Sin red se sigue con lo cacheado.
  } finally {
    listo = true;
    emit();
  }
}

/** Aplica cambios al perfil: primero en local, luego al servidor. */
export async function actualizarPerfil(cambios: Partial<Perfil>): Promise<void> {
  const sesion = getSesion();
  if (!supabase || !sesion || !perfil) return;

  // Para poder deshacer si el servidor rechaza. Ver abajo.
  const anterior = perfil;

  // Optimista: la pantalla responde ya y la red va detrás.
  perfil = { ...perfil, ...cambios };
  emit();
  void guardarCache();

  const fila: Record<string, unknown> = {};
  if ('nombre' in cambios) fila.nombre = cambios.nombre;
  if ('correo' in cambios) fila.correo = cambios.correo;
  if ('fechaNacimiento' in cambios) fila.fecha_nacimiento = cambios.fechaNacimiento;
  if ('intereses' in cambios) fila.intereses = cambios.intereses;
  if ('interesPrincipal' in cambios) fila.interes_principal = cambios.interesPrincipal;
  if ('tema' in cambios) fila.tema = cambios.tema;
  if ('onboardingCompleto' in cambios) fila.onboarding_completo = cambios.onboardingCompleto;
  if (!Object.keys(fila).length) return;

  /*
   * Dos clases de fallo, y solo una se arregla esperando.
   *
   * Sin red: se reintenta la próxima vez que se toque el perfil, y mientras
   * tanto lo optimista es lo correcto — el dato es bueno, solo no ha viajado.
   *
   * Rechazado por la base (una restricción CHECK de `schema.sql`, o RLS):
   * repetirlo no lo va a arreglar nunca. Si se deja lo optimista puesto, la
   * pantalla y la caché guardan un valor que el servidor no tiene, la mentira
   * sobrevive al reinicio y nadie se entera. Ahí hay que deshacer.
   *
   * Ojo: `supabase-js` no lanza en estos casos, devuelve `{ error }`. Por eso
   * antes no saltaba ningún `catch` y el rechazo se perdía sin mirarlo.
   */
  try {
    const { error } = await supabase.from('perfiles').update(fila).eq('id', sesion.user.id);
    // 23514 = check_violation · 23505 = unique_violation · 42501 = RLS
    if (error && ['23514', '23505', '42501'].includes(error.code ?? '') && perfil) {
      /*
       * Se deshacen SOLO las claves que mandó esta llamada, no el objeto
       * entero.
       *
       * Restaurar la instantánea completa parece más simple y está mal: en
       * `perfil.tsx` el nombre y el correo se guardan cada uno en su `onBlur`,
       * así que dos llamadas se solapan sin problema. Si la primera falla y
       * repone su copia de todo, se lleva por delante el cambio bueno que la
       * segunda ya había aplicado.
       */
      const revertido = { ...perfil };
      for (const k of Object.keys(cambios) as (keyof Perfil)[]) {
        (revertido as Record<string, unknown>)[k] = anterior[k];
      }
      perfil = revertido;
      emit();
      void guardarCache();
    }
  } catch {
    // Se reintentará la próxima vez que se toque el perfil.
  }
}

/** Al cerrar sesión: se olvida todo lo del perfil. */
export function olvidarPerfil(): void {
  perfil = null;
  listo = false;
  emit();
  void AsyncStorage.removeItem(CLAVE_CACHE).catch(() => {});
}

// — Edad —

/** Años cumplidos a día de hoy, o `null` si no hay fecha. */
export function edadDe(fechaNacimiento: string | null, hoy = new Date()): number | null {
  if (!fechaNacimiento) return null;
  const n = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(n.getTime())) return null;
  let edad = hoy.getFullYear() - n.getFullYear();
  const mes = hoy.getMonth() - n.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < n.getDate())) edad--;
  return edad;
}

/**
 * Edad mínima para usar la app.
 *
 * 13 es el umbral que exigen las tiendas de aplicaciones para tratar datos de
 * menores sin consentimiento parental. La fecha se guarda igualmente para tener
 * la demografía de quienes sí pasan.
 */
export const EDAD_MINIMA = 13;
