/**
 * Volteo 3D de carta.
 *
 * Compartido por Oráculo, Códigos Sagrados y Cruz de Vida, con la misma curva del
 * diseño: `rotateY` con cubic-bezier(.35,.1,.25,1). El escalonado entre cartas
 * (750 ms en el Oráculo) lo decide quien lo usa, con la prop `retardo`.
 */
import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const EASING = Easing.bezier(0.35, 0.1, 0.25, 1);

type Props = {
  /** Cara visible cuando está volteada hacia arriba */
  frente: ReactNode;
  /** Dorso del naipe */
  dorso: ReactNode;
  /** true → muestra el frente */
  volteada: boolean;
  retardo?: number;
  duracion?: number;
  style?: StyleProp<ViewStyle>;
};

export function Volteo({
  frente,
  dorso,
  volteada,
  retardo = 0,
  duracion = 700,
  style,
}: Props) {
  const giro = useSharedValue(volteada ? 0 : 180);

  useEffect(() => {
    giro.value = withDelay(
      retardo,
      withTiming(volteada ? 0 : 180, { duration: duracion, easing: EASING }),
    );
  }, [volteada, retardo, duracion, giro]);

  const caraFrente = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${giro.value}deg` }],
    // `backfaceVisibility` no es fiable en Android: ocultamos por opacidad.
    opacity: giro.value > 90 ? 0 : 1,
  }));

  const caraDorso = useAnimatedStyle(() => ({
    transform: [{ perspective: 900 }, { rotateY: `${giro.value - 180}deg` }],
    opacity: giro.value > 90 ? 1 : 0,
  }));

  return (
    <View style={style}>
      <Animated.View style={caraFrente}>{frente}</Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, caraDorso]}>
        {dorso}
      </Animated.View>
    </View>
  );
}
