/**
 * Medidas que se adaptan al ancho real de la pantalla.
 *
 * El diseño está dibujado sobre una columna de 430 px. En pantallas más angostas
 * todo debe encogerse proporcionalmente en vez de desbordarse, y en pantallas
 * anchas la columna se queda en 430 px y se centra.
 */
import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme/tokens';

/** Ancho útil dentro de los márgenes laterales de la pantalla. */
export function useAnchoContenido(): number {
  const { width } = useWindowDimensions();
  const columna = Math.min(width, layout.maxWidth);
  return Math.max(240, columna - layout.screenPaddingH * 2);
}

/**
 * Factor de escala respecto al diseño de referencia (1 = 430 px o más).
 * Sirve para encoger naipes y animaciones sin recalcular cada medida.
 */
export function useEscala(): number {
  const { width } = useWindowDimensions();
  return Math.min(1, width / layout.maxWidth);
}

/**
 * Ancho de cada celda en una rejilla de `columnas` con `hueco` px de separación.
 *
 * Se redondea hacia abajo a propósito: con decimales, la suma de las celdas más
 * los huecos puede pasarse por una fracción de píxel y tirar la última columna a
 * la fila siguiente. El sobrante queda como holgura y lo absorbe el centrado.
 */
export function anchoCelda(anchoTotal: number, columnas: number, hueco: number): number {
  return Math.floor((anchoTotal - hueco * (columnas - 1)) / columnas);
}
