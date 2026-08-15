/**
 * Dónde vive la sesión de Supabase.
 *
 * Hasta ahora vivía en AsyncStorage, que es el equivalente en React Native a
 * `localStorage`: un fichero en claro dentro del contenedor de la app. Ahí
 * dentro está el *refresh token*, que no caduca al poco como el de acceso y
 * vale para pedir sesiones nuevas indefinidamente. En un teléfono con root, o
 * en una copia de seguridad sin cifrar, se saca leyendo un archivo.
 *
 * `expo-secure-store` lo guarda en el llavero del sistema (Keychain en iOS,
 * Keystore en Android), que es almacenamiento cifrado y respaldado por
 * hardware. Es la diferencia entre "cualquiera que llegue al disco lo lee" y
 * "hace falta comprometer el sistema operativo".
 *
 * Dos cosas que hay que resolver para poder usarlo, y por eso este archivo:
 *
 *  1. **El tamaño.** SecureStore avisa (Android) por encima de ~2 KB por valor,
 *     y una sesión de Supabase con sus dos JWT pasa de ahí de sobra. Se parte en
 *     trozos y se guarda un índice con cuántos son.
 *
 *  2. **Lo que ya está guardado.** Quien tenga la app instalada tiene su sesión
 *     en AsyncStorage. Si esto la ignorara, actualizar cerraría la sesión de
 *     todo el mundo — y como hoy las cuentas son anónimas y van atadas al
 *     dispositivo, cerrar sesión es perder la cuenta. Así que la primera lectura
 *     se trae lo viejo, lo reescribe en el llavero y lo borra de donde estaba.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/** Por debajo del aviso de Android (2048), con margen para la clave y el índice. */
const TROZO = 1800;

/** Guarda cuántos trozos componen el valor. Sin esto no se sabe hasta dónde leer. */
const claveIndice = (k: string) => `${k}__n`;
const claveTrozo = (k: string, i: number) => `${k}__${i}`;

/**
 * SecureStore solo admite `[A-Za-z0-9._-]` en las claves. Las de Supabase son
 * del tipo `sb-<ref>-auth-token`, que ya cumple, pero normalizar evita que un
 * cambio de formato al otro lado rompa el guardado en silencio.
 */
function normalizar(clave: string): string {
  return clave.replace(/[^A-Za-z0-9._-]/g, '_');
}

async function leerDeSecureStore(clave: string): Promise<string | null> {
  const k = normalizar(clave);
  const n = Number(await SecureStore.getItemAsync(claveIndice(k)));
  if (!n || Number.isNaN(n)) return null;

  const trozos: string[] = [];
  for (let i = 0; i < n; i++) {
    const trozo = await SecureStore.getItemAsync(claveTrozo(k, i));
    // Un trozo perdido deja un JSON cortado, que es peor que no tener nada:
    // Supabase intentaría parsearlo y fallaría en cada arranque.
    if (trozo === null) return null;
    trozos.push(trozo);
  }
  return trozos.join('');
}

async function borrarDeSecureStore(clave: string): Promise<void> {
  const k = normalizar(clave);
  const n = Number(await SecureStore.getItemAsync(claveIndice(k)));
  if (n && !Number.isNaN(n)) {
    for (let i = 0; i < n; i++) {
      await SecureStore.deleteItemAsync(claveTrozo(k, i));
    }
  }
  await SecureStore.deleteItemAsync(claveIndice(k));
}

async function escribirEnSecureStore(clave: string, valor: string): Promise<void> {
  const k = normalizar(clave);
  // Lo anterior se va primero: si el valor nuevo tiene menos trozos, los que
  // sobran del anterior quedarían ahí y una lectura futura los mezclaría.
  await borrarDeSecureStore(clave);

  const trozos: string[] = [];
  for (let i = 0; i < valor.length; i += TROZO) {
    trozos.push(valor.slice(i, i + TROZO));
  }

  for (let i = 0; i < trozos.length; i++) {
    await SecureStore.setItemAsync(claveTrozo(k, i), trozos[i]);
  }
  // El índice va al final, a propósito: mientras no exista, la lectura devuelve
  // `null` y no una sesión a medio escribir.
  await SecureStore.setItemAsync(claveIndice(k), String(trozos.length));
}

/**
 * Adaptador de almacenamiento para `createClient`.
 *
 * Es tolerante a fallos por diseño: si el llavero no está disponible (algún
 * emulador sin bloqueo de pantalla configurado, por ejemplo), se comporta como
 * si no hubiera sesión guardada en vez de tumbar el arranque de la app.
 */
export const almacenSesion = {
  async getItem(clave: string): Promise<string | null> {
    try {
      const seguro = await leerDeSecureStore(clave);
      if (seguro !== null) return seguro;

      // Migración: lo que quedó de la versión que guardaba en AsyncStorage.
      const viejo = await AsyncStorage.getItem(clave);
      if (viejo === null) return null;

      await escribirEnSecureStore(clave, viejo);
      await AsyncStorage.removeItem(clave);
      return viejo;
    } catch {
      return null;
    }
  },

  async setItem(clave: string, valor: string): Promise<void> {
    try {
      await escribirEnSecureStore(clave, valor);
    } catch {
      // Sin sitio donde guardar, la sesión dura lo que dure la app abierta.
      // Es peor experiencia, pero no es un fallo que deba romper nada.
    }
  },

  async removeItem(clave: string): Promise<void> {
    try {
      await borrarDeSecureStore(clave);
    } catch {
      // Nada que hacer: cerrar sesión no puede fallar de cara al usuario.
    }
    // Por si quedaba rastro de antes de la migración.
    try {
      await AsyncStorage.removeItem(clave);
    } catch {
      // Igual que arriba.
    }
  },
};
