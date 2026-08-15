/**
 * Notificaciones locales.
 *
 * Dos tipos, según el gancho de retención:
 *  1. Aviso de desbloqueo — cuando una lectura con temporizador vuelve a estar disponible.
 *  2. Recordatorio aleatorio — en momentos al azar *dentro* de la ventana activa de la
 *     afirmación y el código, invitando a repetirlos para que no se olviden.
 *
 * Todo se reprograma de cero en cada cambio de estado: es más simple que llevar
 * la cuenta de identificadores y evita duplicados.
 */
/*
 * Se importa cada función por su módulo en vez de desde `expo-notifications`.
 *
 * El barril del paquete arrastra `getExpoPushTokenAsync`, que al cargarse
 * registra un listener de push token; en Expo Go sobre Android eso escupe un
 * `console.error` rojo al arrancar avisando de que las push remotas ya no
 * existen ahí. Prisma Azul solo usa notificaciones **locales**, así que el aviso
 * era ruido puro: importando lo justo, no se carga esa parte del paquete.
 */
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import cancelAllScheduledNotificationsAsync from 'expo-notifications/build/cancelAllScheduledNotificationsAsync';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { Platform } from 'react-native';

import { getPerfil } from '@/lib/perfil';
import type { State } from '@/lib/store';

setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Horas en las que es razonable avisar (no de madrugada). */
const HORA_MIN = 9;
const HORA_MAX = 21;

/**
 * Los recordatorios son **diarios**: uno cada día, a una hora distinta, hasta
 * que la afirmación y el código se renuevan. La práctica pide repetirlos 45 veces
 * al día, así que un aviso semanal no sostendría la práctica.
 */
const DIAS_MAXIMOS = 7;

/**
 * `{nombre}` se sustituye por el nombre de pila, y si no lo hay la frase se
 * reescribe sin él. Por eso cada mensaje viene en dos versiones: encajar un
 * nombre a la fuerza produce frases raras cuando falta.
 */
const MENSAJES_RECORDATORIO: { con: string; sin: string }[] = [
  {
    con: '{nombre}, no olvides repetir tu código y tu afirmación hoy.',
    sin: 'No olvides repetir tu código y tu afirmación hoy.',
  },
  {
    con: 'Un momento para ti, {nombre}: repite tu afirmación y tu código sagrado.',
    sin: 'Un momento para ti: repite tu afirmación y tu código sagrado.',
  },
  {
    con: 'Tu código pide constancia, {nombre}. Repítelo 45 veces hoy ✦',
    sin: 'Tu código pide constancia. Repítelo 45 veces hoy ✦',
  },
  {
    con: 'Respira, {nombre}, y vuelve a tu afirmación. La palabra se hace tuya al repetirla.',
    sin: 'Respira y vuelve a tu afirmación. La palabra se hace tuya al repetirla.',
  },
  {
    con: '{nombre}, la energía se sostiene con la práctica. Repite tu código y tu afirmación.',
    sin: 'La energía se sostiene con la práctica. Repite tu código y tu afirmación.',
  },
  {
    con: 'Vuelve a Prisma Azul, {nombre}: relee lo que el universo eligió para ti 🌙',
    sin: 'Vuelve a Prisma Azul y relee lo que el universo eligió para ti 🌙',
  },
];

/** Solo el primer nombre: los avisos con nombre completo suenan a formulario. */
function nombreDePila(): string {
  const completo = getPerfil()?.nombre?.trim() ?? '';
  return completo ? completo.split(/\s+/)[0] : '';
}

function elegirMensaje(i: number, nombre: string): string {
  const m = MENSAJES_RECORDATORIO[i % MENSAJES_RECORDATORIO.length];
  return nombre ? m.con.replace('{nombre}', nombre) : m.sin;
}

let permisoConcedido: boolean | null = null;

/** Pide permiso una vez y cachea la respuesta. */
export async function pedirPermiso(): Promise<boolean> {
  if (permisoConcedido !== null) return permisoConcedido;
  try {
    const actual = await getPermissionsAsync();
    let status = actual.status;
    if (status !== 'granted') {
      const pedido = await requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      status = pedido.status;
    }
    permisoConcedido = status === 'granted';
  } catch {
    permisoConcedido = false;
  }
  return permisoConcedido;
}

/** Canal de Android; debe existir antes de programar nada. */
export async function prepararCanal(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await setNotificationChannelAsync('rituales', {
      // El identificador del canal ('rituales') no se toca: cambiarlo crearía un
      // canal nuevo en los teléfonos que ya tienen la app, y el viejo quedaría
      // vivo con el nombre anterior. Lo que la persona ve es este `name`.
      name: 'Lecturas de Prisma Azul',
      importance: AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ecc874',
    });
  } catch {
    // Sin canal las notificaciones no se muestran en Android, pero la app sigue funcionando.
  }
}

/** Mueve una fecha a la franja horaria permitida, conservando el día. */
function dentroDeHorario(d: Date): Date {
  const out = new Date(d);
  if (out.getHours() < HORA_MIN) out.setHours(HORA_MIN, 0, 0, 0);
  if (out.getHours() >= HORA_MAX) out.setHours(HORA_MAX - 1, 30, 0, 0);
  return out;
}

async function programar(
  title: string,
  body: string,
  fecha: Date,
): Promise<void> {
  if (fecha.getTime() <= Date.now() + 60_000) return;
  try {
    await scheduleNotificationAsync({
      content: { title, body, data: { origen: 'prisma-azul' } },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: fecha },
    });
  } catch {
    // Un fallo al programar no debe romper el flujo de la pantalla.
  }
}

/**
 * Lanza un aviso **ahora mismo**, sin programarlo.
 *
 * Lo usan los "Restablecer (demo)": al poner el temporizador a 0 la sección
 * queda disponible, y esto es el aviso que el usuario habría recibido al vencer
 * la espera de verdad.
 *
 * Se entrega en el acto (`trigger: null`) en vez de agendarse, porque
 * `reprogramar` cancela todo lo pendiente en cuanto cambia el estado — y un
 * aviso agendado aquí se borraría a sí mismo un instante después.
 */
export async function avisarAhora(body: string): Promise<void> {
  const ok = await pedirPermiso();
  if (!ok) return;
  await prepararCanal();
  try {
    await scheduleNotificationAsync({
      content: { title: 'Prisma Azul', body, data: { origen: 'prisma-azul' } },
      trigger: null,
    });
  } catch {
    // En web no hay notificaciones locales; la pantalla sigue funcionando igual.
  }
}

/**
 * Un instante al azar por día, entre hoy y `hasta`, dentro del horario
 * permitido.
 *
 * Uno por día y no varios: el recordatorio debe acompañar, no acosar. La hora
 * cambia cada día a propósito — un aviso siempre a la misma hora se vuelve
 * paisaje y se deja de ver.
 */
function unoPorDia(hasta: number): Date[] {
  const ahora = Date.now();
  if (hasta <= ahora) return [];

  const out: Date[] = [];
  const dia = new Date();
  dia.setHours(0, 0, 0, 0);

  for (let i = 0; i < DIAS_MAXIMOS; i++) {
    const base = new Date(dia);
    base.setDate(base.getDate() + i);
    // Hora al azar dentro de la franja permitida.
    const hora = HORA_MIN + Math.random() * (HORA_MAX - HORA_MIN);
    base.setHours(Math.floor(hora), Math.floor((hora % 1) * 60), 0, 0);

    const t = base.getTime();
    // El de hoy se descarta si ya pasó; y nunca se pasa del vencimiento.
    if (t > ahora + 60_000 && t <= hasta) out.push(base);
    if (t > hasta) break;
  }
  return out;
}

/**
 * Reprograma todos los avisos a partir del estado actual.
 * Idempotente: cancela lo pendiente y vuelve a crear lo que corresponde.
 */
export async function reprogramar(s: State): Promise<void> {
  const ok = await pedirPermiso();
  if (!ok) return;
  await prepararCanal();

  try {
    await cancelAllScheduledNotificationsAsync();
  } catch {
    return;
  }

  const nombre = nombreDePila();
  // Cada lectura tiene su propio aviso, al vencer su propio temporizador.
  const de = (con: string, sin: string) => (nombre ? con.replace('{nombre}', nombre) : sin);

  // — Avisos de desbloqueo —
  if (s.notif.afirmacion && s.afirmacionLock > Date.now()) {
    await programar(
      'Prisma Azul',
      de(
        '✨ {nombre}, tu afirmación de la semana ya está lista.',
        '✨ Nueva semana, nueva afirmación. Ven a recibirla.',
      ),
      dentroDeHorario(new Date(s.afirmacionLock)),
    );
  }

  if (s.notif.codigo && s.codigoActivo && s.codigoActivo.unlockAt > Date.now()) {
    await programar(
      'Prisma Azul',
      de(
        '🌙 {nombre}, hay un código nuevo esperándote.',
        '🌙 Nueva semana, nuevo código. Ven a recibirlo.',
      ),
      dentroDeHorario(new Date(s.codigoActivo.unlockAt)),
    );
  }

  if (s.notif.oraculo && s.oraculoLock > Date.now()) {
    await programar(
      'Prisma Azul',
      de(
        '✨ {nombre}, tu oráculo está listo. Un mensaje te espera.',
        '✨ Tu oráculo está listo. Un nuevo mensaje te espera.',
      ),
      dentroDeHorario(new Date(s.oraculoLock)),
    );
  }

  if (s.notif.cruz && s.cruzNext > Date.now()) {
    await programar(
      'Prisma Azul',
      de(
        '🌙 {nombre}, la Cruz de Vida se abre de nuevo. Tu lectura de la semana te espera.',
        '🌙 La Cruz de Vida se abre de nuevo. Tu lectura de la semana te espera.',
      ),
      dentroDeHorario(new Date(s.cruzNext)),
    );
  }

  // — Recordatorios diarios dentro de la ventana activa —
  //
  // Solo si hay algo que repetir: una afirmación o un código vigentes. Y solo
  // si esos avisos están encendidos — recordar a diario algo que la persona
  // pidió no recibir sería justo lo contrario de acompañar.
  const finAfirmacion = s.notif.afirmacion && s.afirmacionLast ? s.afirmacionLock : 0;
  const finCodigo = s.notif.codigo && s.codigoActivo ? s.codigoActivo.unlockAt : 0;
  const ventana = Math.max(finAfirmacion, finCodigo);

  if (ventana > Date.now()) {
    const momentos = unoPorDia(ventana);
    for (let i = 0; i < momentos.length; i++) {
      await programar('Prisma Azul', elegirMensaje(i, nombre), momentos[i]);
    }
  }
}
