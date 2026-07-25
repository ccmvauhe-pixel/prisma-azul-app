/**
 * Temporizadores y formato de cuentas atrás.
 * El tick de 1 s solo corre en la vista visible, como en los prototipos.
 */
import { useEffect, useState } from 'react';

/** Reloj que avanza cada `ms` mientras `activo` sea true. */
export function useTick(activo = true, ms = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!activo) return;
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [activo, ms]);
  return now;
}

/**
 * Formato compacto usado en las píldoras de Mi Camino: `3 d 4 h`, `4 h 05 m`, `5 m 09 s`.
 * Portado de `fmt()` en el prototipo del hub.
 */
export function fmtCorto(ms: number): string {
  if (ms <= 0) return 'ahora';
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  if (d > 0) return `${d} d ${h} h`;
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} m`;
  return `${m} m ${String(s).padStart(2, '0')} s`;
}

/** Cuenta atrás grande de las pantallas bloqueadas: `12 h 04 m 09 s` */
export function fmtLargo(ms: number): string {
  const clamped = Math.max(0, ms);
  const d = Math.floor(clamped / 86_400_000);
  const h = Math.floor((clamped % 86_400_000) / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  if (d > 0) return `${d} d ${h} h ${String(m).padStart(2, '0')} m`;
  return `${h} h ${String(m).padStart(2, '0')} m ${String(s).padStart(2, '0')} s`;
}

/** Cuenta atrás semanal de Códigos Sagrados: `4 d 6 h` o `6 h 05 m` */
export function fmtSemanal(ms: number): string {
  const clamped = Math.max(0, ms);
  const d = Math.floor(clamped / 86_400_000);
  const h = Math.floor((clamped % 86_400_000) / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  return d > 0 ? `${d} d ${h} h` : `${h} h ${String(m).padStart(2, '0')} m`;
}

const FECHA_CORTA: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

export function fechaCorta(ts: number): string {
  return new Date(ts).toLocaleDateString('es-MX', FECHA_CORTA);
}

/** Cabecera de Mi Camino: `viernes, 24 jul` */
export function fechaHoy(ts: number): string {
  return new Date(ts).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

/** Recorta a `n` caracteres sin partir palabras, añadiendo elipsis. */
export function recortar(s: string, n: number): string {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s;
}
