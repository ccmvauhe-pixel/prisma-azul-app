/**
 * Notificaciones locales.
 *
 * Dos tipos, según el gancho de retención:
 *  1. Aviso de desbloqueo — cuando un ritual con temporizador vuelve a estar disponible.
 *  2. Recordatorio aleatorio — en momentos al azar *dentro* de la ventana activa de la
 *     afirmación y el código, invitando a repetirlos para que no se olviden.
 *
 * Todo se reprograma de cero en cada cambio de estado: es más simple que llevar
 * la cuenta de identificadores y evita duplicados.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { State } from '@/lib/store';

Notifications.setNotificationHandler({
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

/** Cuántos recordatorios al azar repartir en la ventana activa. */
const RECORDATORIOS_POR_VENTANA = 4;

const MENSAJES_RECORDATORIO = [
  'No olvides repetir tu código y tu afirmación hoy. Si no los recuerdas, léelos de nuevo.',
  'Un momento para ti: repite tu afirmación y tu código sagrado.',
  'Tu código pide constancia. Repítelo 45 veces hoy ✦',
  'Respira y vuelve a tu afirmación. La palabra se hace tuya al repetirla.',
  'La energía se sostiene con la práctica. Repite tu código y tu afirmación.',
  'Vuelve a Prisma Azul y relee lo que el universo eligió para ti 🌙',
];

let permisoConcedido: boolean | null = null;

/** Pide permiso una vez y cachea la respuesta. */
export async function pedirPermiso(): Promise<boolean> {
  if (permisoConcedido !== null) return permisoConcedido;
  try {
    const actual = await Notifications.getPermissionsAsync();
    let status = actual.status;
    if (status !== 'granted') {
      const pedido = await Notifications.requestPermissionsAsync({
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
    await Notifications.setNotificationChannelAsync('rituales', {
      name: 'Rituales de Prisma Azul',
      importance: Notifications.AndroidImportance.DEFAULT,
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
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { origen: 'prisma-azul' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fecha },
    });
  } catch {
    // Un fallo al programar no debe romper el flujo de la pantalla.
  }
}

/**
 * Reparte `cantidad` instantes al azar entre ahora y `hasta`, dentro del horario
 * permitido. Se usa para los recordatorios de afirmación y código.
 */
function instantesAleatorios(hasta: number, cantidad: number): Date[] {
  const ahora = Date.now();
  if (hasta <= ahora) return [];
  const tramo = (hasta - ahora) / cantidad;
  const out: Date[] = [];
  for (let i = 0; i < cantidad; i++) {
    const inicio = ahora + tramo * i;
    const fin = inicio + tramo;
    const t = inicio + Math.random() * (fin - inicio);
    const fecha = dentroDeHorario(new Date(t));
    if (fecha.getTime() > ahora && fecha.getTime() <= hasta) out.push(fecha);
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
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    return;
  }

  // — Avisos de desbloqueo —
  if (s.notif.afirmacion && s.afirmacionLock > Date.now()) {
    await programar(
      'Prisma Azul',
      '✨ Nueva semana, nueva afirmación. Ven a recibirla.',
      dentroDeHorario(new Date(s.afirmacionLock)),
    );
  }

  if (s.notif.codigo && s.codigoActivo && s.codigoActivo.unlockAt > Date.now()) {
    await programar(
      'Prisma Azul',
      '🌙 Nueva semana, nuevo código. Ven a recibirlo.',
      dentroDeHorario(new Date(s.codigoActivo.unlockAt)),
    );
  }

  if (s.notif.oraculo && s.oraculoLock > Date.now()) {
    await programar(
      'Prisma Azul',
      '✨ Tu oráculo está listo. Un nuevo mensaje te espera.',
      dentroDeHorario(new Date(s.oraculoLock)),
    );
  }

  if (s.notif.cruz && s.cruzNext > Date.now()) {
    await programar(
      'Prisma Azul',
      '🌙 La Cruz de Vida se abre de nuevo. Tu lectura del mes te espera.',
      dentroDeHorario(new Date(s.cruzNext)),
    );
  }

  // — Recordatorios aleatorios dentro de la ventana activa —
  // Solo tienen sentido si hay algo que repetir: una afirmación o un código vigentes.
  const finAfirmacion = s.afirmacionLast ? s.afirmacionLock : 0;
  const finCodigo = s.codigoActivo ? s.codigoActivo.unlockAt : 0;
  const ventana = Math.max(finAfirmacion, finCodigo);

  if (ventana > Date.now()) {
    const momentos = instantesAleatorios(ventana, RECORDATORIOS_POR_VENTANA);
    for (let i = 0; i < momentos.length; i++) {
      const mensaje = MENSAJES_RECORDATORIO[i % MENSAJES_RECORDATORIO.length];
      await programar('Prisma Azul', mensaje, momentos[i]);
    }
  }
}
