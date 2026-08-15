/**
 * Acceso por enlace mágico.
 *
 * No hay contraseñas: se pide un correo, Supabase manda un enlace y al abrirlo
 * el sistema operativo devuelve a la app con un `code` de un solo uso que se
 * canjea por una sesión.
 *
 * La sesión se expone con `useSyncExternalStore`, igual que el estado de la
 * app, para que las pantallas reaccionen sin prop drilling.
 */
import type { Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { useSyncExternalStore } from 'react';

import { supabase } from '@/lib/supabase';

let sesion: Session | null = null;
let listo = false;
/**
 * Cierto justo después de abrir un enlace de recuperación.
 *
 * Supabase deja la sesión iniciada al canjear ese enlace, así que sin esta
 * marca la persona entraría a la app sin llegar a elegir contraseña nueva — y
 * el problema que la trajo aquí seguiría sin resolverse.
 */
let enRecuperacion = false;
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

/** La sesión actual, o `null` si no hay nadie dentro. */
export function useSesion(): Session | null {
  return useSyncExternalStore(
    subscribe,
    () => sesion,
    () => sesion,
  );
}

/**
 * ¿Ya sabemos si hay sesión o no?
 *
 * Importa para no parpadear: al arrancar, leer la sesión de disco es asíncrono,
 * y sin esto la app mostraría la pantalla de acceso un instante a quien ya
 * había entrado.
 */
export function useAuthLista(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => listo,
    () => listo,
  );
}

export function getSesion(): Session | null {
  return sesion;
}

/**
 * Arranca el seguimiento de la sesión. Se llama una vez, al montar la app.
 * Devuelve la función para dejar de escuchar.
 */
export function iniciarAuth(): () => void {
  if (!supabase) {
    // Sin backend no hay sesión posible, pero la app sigue siendo usable.
    listo = true;
    emit();
    return () => {};
  }

  void supabase.auth.getSession().then(({ data }) => {
    sesion = data.session;
    listo = true;
    emit();
  });

  const { data } = supabase.auth.onAuthStateChange((evento, nueva) => {
    sesion = nueva;
    listo = true;
    // Supabase avisa con este evento al canjear un enlace de recuperación.
    if (evento === 'PASSWORD_RECOVERY') enRecuperacion = true;
    if (evento === 'SIGNED_OUT') enRecuperacion = false;
    emit();
  });

  return () => data.subscription.unsubscribe();
}

/** ¿Venimos de un enlace de recuperación y falta elegir contraseña? */
export function useEnRecuperacion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enRecuperacion,
    () => enRecuperacion,
  );
}

/** Se llama al terminar de fijar la contraseña nueva. */
export function terminarRecuperacion(): void {
  enRecuperacion = false;
  emit();
}

/**
 * A dónde debe devolver Supabase tras pulsar el enlace.
 *
 * `createURL` resuelve solo según dónde corra la app: en una build instalada da
 * `prismaazul://auth-callback`, y en Expo Go da `exp://<host>/--/auth-callback`,
 * porque allí la app vive dentro de Expo y no bajo su propio esquema.
 *
 * Las dos formas deben estar dadas de alta en Supabase → Authentication → URL
 * Configuration → Redirect URLs, o el enlace abre y no inicia sesión.
 */
export function urlDeRetorno(): string {
  return Linking.createURL('/auth-callback');
}

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function correoValido(email: string): boolean {
  return CORREO_VALIDO.test(email.trim().toLowerCase());
}

/**
 * Abre una sesión anónima si todavía no hay ninguna.
 *
 * Es el acceso actual: sin contraseña y sin enviar correos, así que nadie se
 * queda fuera esperando un mensaje que no llega. El nombre y el correo se piden
 * después, en el onboarding, y viven en `perfiles`.
 *
 * El precio, y hay que tenerlo presente: la cuenta va atada a este dispositivo.
 * Al desinstalar la app se pierde. Cuando haya contraseñas, esta misma cuenta
 * se podrá convertir en una de verdad sin perder nada.
 */
export async function entrarAnonimo(): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (data.session) return;
  try {
    await supabase.auth.signInAnonymously();
  } catch {
    // Sin red la app sigue funcionando en local; se reintenta al reabrir.
  }
}

function normalizarCorreo(email: string): string {
  const limpio = email.trim().toLowerCase();
  if (!CORREO_VALIDO.test(limpio)) throw new Error('Ese correo no parece válido.');
  return limpio;
}

/** Crea la cuenta. El nombre viaja en los metadatos y de ahí lo toma el perfil. */
export async function registrar(
  nombre: string,
  email: string,
  password: string,
): Promise<void> {
  if (!supabase) throw new Error('No hay backend configurado.');
  const limpio = normalizarCorreo(email);
  if (nombre.trim().length < 2) throw new Error('Escribe tu nombre.');
  if (password.length < 8) {
    throw new Error('La contraseña necesita al menos 8 caracteres.');
  }
  const { error } = await supabase.auth.signUp({
    email: limpio,
    password,
    options: { data: { nombre: nombre.trim() }, emailRedirectTo: urlDeRetorno() },
  });
  if (error) throw new Error(traducirError(error.message));
}

/** Entra con correo y contraseña. */
export async function entrar(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('No hay backend configurado.');
  const limpio = normalizarCorreo(email);
  if (!password) throw new Error('Escribe tu contraseña.');
  const { error } = await supabase.auth.signInWithPassword({
    email: limpio,
    password,
  });
  if (error) throw new Error(traducirError(error.message));
}

/**
 * Envía el correo para restablecer la contraseña.
 *
 * Aquí sigue viviendo el enlace mágico: al abrirlo, `procesarEnlace` canjea el
 * código por una sesión y desde el perfil se puede fijar una contraseña nueva.
 */
export async function recuperarPassword(email: string): Promise<void> {
  if (!supabase) throw new Error('No hay backend configurado.');
  const limpio = normalizarCorreo(email);
  const { error } = await supabase.auth.resetPasswordForEmail(limpio, {
    redirectTo: urlDeRetorno(),
  });
  if (error) throw new Error(traducirError(error.message));
}

/** Cambia la contraseña de quien ya tiene sesión. */
export async function cambiarPassword(password: string): Promise<void> {
  if (!supabase) throw new Error('No hay backend configurado.');
  if (password.length < 8) {
    throw new Error('La contraseña necesita al menos 8 caracteres.');
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(traducirError(error.message));
}

/** Cambia el correo. Supabase pedirá confirmarlo desde la dirección nueva. */
export async function cambiarCorreo(email: string): Promise<void> {
  if (!supabase) throw new Error('No hay backend configurado.');
  const limpio = normalizarCorreo(email);
  const { error } = await supabase.auth.updateUser({ email: limpio });
  if (error) throw new Error(traducirError(error.message));
}

/** La única ruta que puede traer una sesión. Cualquier otra no se mira. */
const RUTA_CALLBACK = 'auth-callback';

/**
 * ¿Este enlace apunta al callback de autenticación?
 *
 * Se resuelve a mano en vez de con `Linking.parse` porque esa función se apoya
 * en `new URL()`, y ahí las dos formas que usamos de verdad salen distintas:
 *
 *   prismaazul://auth-callback?code=…        → path `null`, hostname `auth-callback`
 *   exp://192.168.1.5:8081/--/auth-callback  → path `--/auth-callback`
 *
 * Ninguna de las dos es `auth-callback` a secas, así que comparar contra `path`
 * rechazaría precisamente los enlaces buenos.
 *
 * Se mira el último segmento: el host, el puerto y el `--/` que mete Expo Go
 * sobran, y lo que queda es la ruta que pidió `createURL('/auth-callback')`.
 */
export function esRutaCallback(url: string): boolean {
  const sinParametros = url.split(/[?#]/)[0];
  const sinEsquema = sinParametros.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');
  const segmentos = sinEsquema.split('/').filter((s) => s && s !== '--');
  return segmentos[segmentos.length - 1] === RUTA_CALLBACK;
}

/**
 * Procesa la vuelta del enlace mágico.
 *
 * Contempla las dos formas en que Supabase responde con este cliente:
 *  - PKCE: `?code=…` — el flujo configurado en `supabase.ts`.
 *  - Error: `?error=…&error_description=…` — enlace caducado o ya usado.
 *
 * Tres cosas que parecen de más y no lo son:
 *
 *  1. **Se comprueba la ruta.** `_layout` llama aquí con *cualquier* enlace que
 *     abra la app, no solo con los de Supabase.
 *
 *  2. **El orden importa.** Nada del enlace se aplica al estado hasta que el
 *     código se canjea con éxito. Los parámetros los escribe quien fabrique la
 *     URL, así que actuar sobre ellos antes de validar el código convierte
 *     cualquier enlace en un mando a distancia de la app.
 *
 *  3. **No se aceptan `access_token`/`refresh_token` sueltos.** Era el apaño
 *     para el flujo implícito, que aquí no se usa. El problema es que esos
 *     tokens valen tal cual: un enlace ajeno con un par cualquiera metía a la
 *     persona en una cuenta que no es la suya, y todo lo que guardara después
 *     acababa sincronizado en la cuenta de quien preparó el enlace. Con PKCE no
 *     pasa: el `code` es de un solo uso y no sirve sin el verificador que se
 *     quedó en este teléfono.
 */
export async function procesarEnlace(url: string): Promise<'ok' | 'nada' | string> {
  if (!supabase) return 'nada';

  if (!esRutaCallback(url)) return 'nada';

  const params = parametrosDe(url);

  const errorDesc = params.get('error_description') ?? params.get('error');
  if (errorDesc) return traducirError(errorDesc);

  const code = params.get('code');
  if (!code) return 'nada';

  /*
   * El propio enlace declara para qué es. Se mira además de escuchar el evento
   * `PASSWORD_RECOVERY` porque con PKCE el canje puede llegar como un inicio de
   * sesión normal, y entonces nadie pediría la contraseña nueva.
   *
   * Se anota, pero NO se aplica todavía: ver abajo.
   */
  const esRecuperacion = params.get('type') === 'recovery';

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Un canje fallido dejaría `enRecuperacion` encendido y la compuerta de
    // contraseña nueva puesta sin sesión con la que cambiarla.
    enRecuperacion = false;
    emit();
    return traducirError(error.message);
  }

  /*
   * La compuerta se levanta solo con un canje válido, y por eso este bloque va
   * después y no antes.
   *
   * `type=recovery` es un parámetro de URL: lo escribe cualquiera. Aplicarlo
   * antes de canjear el código dejaba la bandera puesta con un enlace que no
   * traía código ninguno — `prismaazul://auth-callback?type=recovery` desde
   * cualquier página web bastaba. La persona quedaba atrapada en la pantalla de
   * contraseña nueva, y con las cuentas anónimas de hoy la única salida
   * ("Cancelar y salir") borra la cuenta para siempre.
   */
  if (esRecuperacion) {
    enRecuperacion = true;
    emit();
  }
  return 'ok';
}

/**
 * Saca los parámetros de la URL vengan donde vengan.
 *
 * Hay que mirar la query *y* el fragmento: Supabase devuelve los errores tras
 * `#` en algunos casos, y `Linking.parse` no expone esa parte.
 */
function parametrosDe(url: string): URLSearchParams {
  const salida = new URLSearchParams();

  const guardar = (trozo: string) => {
    if (!trozo) return;
    for (const [k, v] of new URLSearchParams(trozo)) salida.set(k, v);
  };

  const hash = url.indexOf('#');
  const query = url.indexOf('?');

  if (query !== -1) {
    const hasta = hash > query ? hash : url.length;
    guardar(url.slice(query + 1, hasta));
  }
  if (hash !== -1) guardar(url.slice(hash + 1));

  return salida;
}

export async function cerrarSesion(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** Los mensajes de Supabase llegan en inglés; aquí los que se ven de verdad. */
function traducirError(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes('invalid login credentials'))
    return 'Correo o contraseña incorrectos.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Ya existe una cuenta con ese correo. Entra en vez de crear una.';
  if (m.includes('password should be') || m.includes('weak password'))
    return 'La contraseña necesita al menos 8 caracteres.';
  /*
   * Con `secure_password_change` activo, Supabase exige haber entrado hace poco
   * para cambiar la contraseña. Sin este caso la pantalla se quedaba muda.
   *
   * Va aquí arriba y no al final a propósito: más abajo hay un `includes
   * ('invalid')` muy ancho que se tragaría cualquier mensaje futuro del
   * proveedor que mezcle las dos palabras.
   */
  if (m.includes('reauthentication') || m.includes('reauthenticate'))
    return 'Por seguridad, vuelve a entrar antes de cambiar la contraseña.';
  if (m.includes('email not confirmed'))
    return 'Falta confirmar tu correo. Revisa tu bandeja.';
  if (m.includes('expired')) return 'Ese enlace ya caducó. Pide uno nuevo.';
  if (m.includes('already been used') || m.includes('invalid'))
    return 'Ese enlace ya no sirve. Pide uno nuevo.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Demasiados intentos. Espera un minuto y vuelve a probar.';
  if (m.includes('network') || m.includes('fetch'))
    return 'No hay conexión. Inténtalo de nuevo.';
  // Nada de texto del proveedor sin traducir: llega en inglés, no lo controla
  // nadie de aquí y puede arrastrar detalles internos a una pantalla.
  return 'Algo salió mal. Inténtalo de nuevo.';
}
