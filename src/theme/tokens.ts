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

/**
 * Color del índice numérico impreso en cada naipe.
 *
 * Los cuatro palos comparten el dorado de oros: el número deja de competir con
 * el emblema, que es quien lleva el color del palo.
 */
export const suitIdxColor = {
  copas: '#f0d488',
  oros: '#f0d488',
  espadas: '#f0d488',
  bastos: '#f0d488',
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

/**
 * Escala tipográfica global. **Este es el mando: un solo número.**
 *
 * Todo el texto de la app pasa por `fs()`, así que subir o bajar este valor
 * reescala la app entera manteniendo intactas las proporciones entre unos
 * tamaños y otros. No hay que tocar ni un `fontSize` suelto.
 *
 *   1     = el diseño original del handoff
 *   1.15  = actual — el cuerpo pasa de 14 a 16 px
 *
 * Si se cambia, hay que revisar dos sitios que dependen del alto del texto y no
 * se ajustan solos, porque son cajas con medida fija:
 *
 *   · `gridCell.minHeight` en `index.tsx` (la rejilla 2×2 del inicio)
 *   · `cajaTexto`/`minHeight` de las tarjetas que envuelven texto largo
 *
 * Están anotados en su sitio. `Naipe.tsx` queda fuera a propósito: su letra se
 * deriva de la geometría de la carta (`u()`, `p()`) y ya escala con ella.
 */
export const ESCALA_TEXTO = 1.15;

/**
 * Aplica la escala a un tamaño del diseño original.
 *
 * Redondea a medio píxel: en Android los tamaños con muchos decimales caen en
 * píxeles distintos según la densidad y dos textos que deberían ir iguales
 * acaban desalineados por una fracción.
 */
export const fs = (n: number): number => Math.round(n * ESCALA_TEXTO * 2) / 2;

/**
 * Escala tipográfica.
 *
 * El handoff mezclaba dieciocho tamaños distintos y varios por debajo de 10 px:
 * legibles en una maqueta vista al 100 % en un monitor, no en un teléfono en la
 * mano. Aquí se reducen a seis escalones y el suelo sube a 11 px, que es el
 * mínimo cómodo para texto en mayúsculas.
 *
 * Menos escalones también es menos ruido: cuando cada dato tiene su propio
 * tamaño, ninguno destaca. Con seis, la jerarquía se lee sola.
 *
 * Los números de abajo son los del diseño; lo que se usa de verdad es su
 * versión escalada por `fs()`.
 */
export const text = {
  /** Kickers y etiquetas en mayúsculas */
  micro: { fontSize: fs(11), lineHeight: fs(15) },
  /** Pies, subtítulos, datos secundarios */
  menor: { fontSize: fs(12.5), lineHeight: fs(18) },
  /** Cuerpo */
  cuerpo: { fontSize: fs(14), lineHeight: fs(21) },
  /** Cuerpo destacado y frases */
  guia: { fontSize: fs(16.5), lineHeight: fs(24) },
  /** Títulos de tarjeta */
  titulo: { fontSize: fs(21), lineHeight: fs(26) },
  /** Título de pantalla */
  display: { fontSize: fs(29), lineHeight: fs(34) },
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
