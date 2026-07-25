/**
 * Tokens de diseño de Prisma Azul.
 * Valores tomados literalmente del handoff de diseño (sección "Design Tokens")
 * y de los prototipos `.dc.html`. No modificar sin actualizar el diseño.
 */

export const color = {
  /** Fondo base de la app */
  base: '#0a0720',
  /** Degradado de escena: #241a4f → #150d34 → #0a0720 */
  scene: ['#241a4f', '#150d34', '#0a0720'] as const,
  /** Dorado principal (títulos) */
  gold: '#e7cf9b',
  /** Degradado del botón primario */
  goldButton: ['#f0d488', '#ecc874', '#d9ab55'] as const,
  goldBright: '#f0d488',
  goldMid: '#ecc874',
  goldDeep: '#d9ab55',
  /** Texto claro */
  cream: '#f3ecdc',
  /** Lavanda (secundario, se usa casi siempre con alfa .5–.78) */
  lavender: '#cdbdf2',
  /** Texto sobre superficies doradas */
  onGold: '#1c1338',
  /** Superficie de tarjeta estándar */
  card: 'rgba(21,13,52,.55)',
  cardSolid: '#150d34',
} as const;

/** Acentos por palo / área. copas=amor, oros=dinero, espadas=aire, bastos=salud */
export const suitColor = {
  copas: '#e79ab4',
  oros: '#ecc874',
  espadas: '#8db0ec',
  bastos: '#86cf9e',
} as const;

/** Color del índice numérico impreso en cada naipe */
export const suitIdxColor = {
  copas: '#f0b9cd',
  oros: '#f0d488',
  espadas: '#aecaf5',
  bastos: '#a8e3bc',
} as const;

export type Suit = keyof typeof suitColor;

/** Degradado del dorso de los naipes */
export const cardBack = ['#2a1f57', '#150d34', '#0b0726'] as const;

export const font = {
  /** Títulos, números de código y frases místicas */
  serif: 'CormorantGaramond_600SemiBold',
  serifBold: 'CormorantGaramond_700Bold',
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  serifItalicBold: 'CormorantGaramond_600SemiBold_Italic',
  /** UI y cuerpo */
  sans: 'HankenGrotesk_400Regular',
  sansMedium: 'HankenGrotesk_500Medium',
  sansSemi: 'HankenGrotesk_600SemiBold',
  sansBold: 'HankenGrotesk_700Bold',
} as const;

export const radius = {
  card: 20,
  cardSmall: 18,
  inner: 16,
  pill: 999,
} as const;

export const layout = {
  /** Ancho de referencia del diseño */
  maxWidth: 430,
  screenPaddingH: 22,
} as const;

/** Alfa sobre un color hex de 6 dígitos → rgba() */
export function alpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Borde y fondo de la tarjeta estándar, con el acento lateral del handoff */
export const cardBorder = 'rgba(231,207,155,.28)';
export const lavenderDim = (a: number) => alpha(color.lavender, a);
export const goldDim = (a: number) => alpha(color.gold, a);
export const creamDim = (a: number) => alpha(color.cream, a);
