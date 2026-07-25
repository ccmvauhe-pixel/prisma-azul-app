/**
 * Emblema de palo (o la corona) dibujado con react-native-svg.
 * Sustituye a los `background-image: url(data:image/svg+xml…)` del prototipo.
 */
import { useId, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { emblems, emblemRatio, type EmblemName } from '@/data/emblems';

/**
 * Los SVG del diseño declaran su degradado como `id="g"`. En web react-native-svg
 * escribe SVG real en el DOM, así que varios emblemas a la vez producirían ids
 * repetidos y todas las referencias `url(#g)` resolverían al primero del documento
 * (y se romperían al desmontarse). Cada instancia reescribe el id al suyo propio.
 */
function conIdUnico(xml: string, uid: string): string {
  return xml.replaceAll('id="g"', `id="${uid}"`).replaceAll('url(#g)', `url(#${uid})`);
}

type Props = {
  name: EmblemName;
  /** Lado mayor en px. El otro se deriva del viewBox para no deformar el trazo. */
  size: number;
  /** Halo de color detrás del emblema (equivale al `drop-shadow` del diseño). */
  glow?: string;
  opacity?: number;
};

export function Emblem({ name, size, glow, opacity = 1 }: Props) {
  const rawId = useId();
  const xml = useMemo(() => {
    const uid = `em${rawId.replace(/[^a-zA-Z0-9]/g, '')}${name}`;
    return conIdUnico(emblems[name], uid);
  }, [rawId, name]);

  const ratio = emblemRatio[name];
  // ratio = ancho/alto. Encajamos el emblema en un cuadrado de lado `size`.
  const width = ratio >= 1 ? size : size * ratio;
  const height = ratio >= 1 ? size / ratio : size;

  const svg = <SvgXml xml={xml} width={width} height={height} opacity={opacity} />;

  if (!glow) return svg;

  return (
    <View
      style={{
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: glow,
        shadowOpacity: 0.55,
        shadowRadius: size * 0.28,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      {svg}
    </View>
  );
}
