/**
 * Cliente de Supabase.
 *
 * La app es local-first y lo seguirá siendo: `store.ts` manda, las pantallas
 * leen de memoria y Supabase sincroniza por detrás. Nada de lo que hay aquí
 * debe bloquear un render.
 *
 * Sin credenciales configuradas la app funciona igual que siempre, solo que sin
 * sincronizar. Por eso todo pasa por `haySupabase`: es lo que permite seguir
 * revisando el diseño en Expo Go sin haber tocado el backend.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { almacenSesion } from '@/lib/almacenSesion';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** ¿Hay backend configurado? Si no, la app corre en modo puramente local. */
export const haySupabase = Boolean(url && anonKey);

/*
 * En desarrollo se puede trabajar sin backend — es lo que permite revisar el
 * diseño en Expo Go sin haber tocado Supabase. En una build publicada no: ahí
 * faltar las variables significa que nadie sincroniza nada y la app lo callaría
 * hasta que alguien se diera cuenta de que perdió sus lecturas al cambiar de
 * teléfono. Mejor que reviente al compilar y arrancar.
 */
if (!haySupabase && !__DEV__) {
  throw new Error(
    'Faltan EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY en esta build. ' +
      'Configúralas en las variables de entorno de EAS antes de publicar.',
  );
}

/**
 * El cliente solo existe si hay credenciales.
 *
 * Devolver `null` en vez de un cliente apuntando a una URL falsa obliga a
 * comprobarlo en cada uso, que es justo lo que queremos: así es imposible
 * lanzar una petición sin querer cuando no hay backend.
 */
export const supabase: SupabaseClient | null = haySupabase
  ? createClient(url!, anonKey!, {
      auth: {
        // El llavero del sistema, no un fichero en claro: dentro de la sesión
        // va el refresh token, que vale indefinidamente. Ver `almacenSesion.ts`.
        storage: almacenSesion,
        autoRefreshToken: true,
        persistSession: true,
        // En nativo la sesión no llega por la URL del navegador; el enlace
        // mágico se procesa a mano desde el deep link (ver `auth.ts`).
        detectSessionInUrl: false,
        /*
         * PKCE en vez del flujo implícito.
         *
         * El enlace trae un `code` de un solo uso que solo sirve acompañado de
         * un verificador guardado en este dispositivo, así que interceptarlo no
         * basta para robar la sesión. A cambio, el correo debe abrirse en el
         * mismo teléfono que pidió el enlace — que es el caso normal.
         */
        flowType: 'pkce',
      },
    })
  : null;

/**
 * Refresca el token solo mientras la app está en primer plano.
 *
 * Sin esto, Supabase mantiene un temporizador vivo en segundo plano gastando
 * batería y fallando peticiones que nadie está esperando.
 */
if (supabase) {
  AppState.addEventListener('change', (estado) => {
    if (estado === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Lanza si no hay backend. Para los caminos que no tienen sentido sin él. */
export function exigirSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase no está configurado: copia .env.example a .env y rellena las credenciales.',
    );
  }
  return supabase;
}
