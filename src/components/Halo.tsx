/**
 * Halo radial de color, usado detrás de la tarjeta del día de vibración, del
 * emblema de las afirmaciones y en los círculos con brillo de los bloqueos.
 * Sustituye a los `radial-gradient(circle, <color>XX, transparent 65%)` del diseño.
 */
import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

/** Ids únicos por instancia: en web los SVG comparten el DOM (ver `Emblem`). */
function useSvgId(prefijo: string): string {
  return `${prefijo}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

export function Halo({
  size,
  color,
  opacity = 0.18,
  /** Punto donde el degradado ya es transparente (0–1) */
  corte = 0.65,
  style,
}: {
  size: number;
  color: string;
  opacity?: number;
  corte?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const id = useSvgId('halo');

  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id}>
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset={String(corte)} stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
