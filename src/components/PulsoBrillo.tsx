/**
 * Resplandor pulsante de los estados bloqueados y del código activo.
 * Porta los keyframes `orGlow` / `afGlow` / `csGlow` (3,4 s en los bloqueos,
 * 4 s en la tarjeta del código activo).
 */
import { type ReactNode, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { color } from '@/theme/tokens';

export function PulsoBrillo({
  children,
  duracion = 3400,
  colorBrillo = color.goldMid,
  style,
}: {
  children: ReactNode;
  duracion?: number;
  colorBrillo?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: duracion / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t, duracion]);

  const estilo = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(t.value, [0, 1], [0.35, 0.7]),
    shadowRadius: interpolate(t.value, [0, 1], [18, 36]),
  }));

  return (
    <Animated.View
      style={[
        {
          shadowColor: colorBrillo,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
        },
        estilo,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** Opacidad que late (`csPulse` / `orPulse` / `afPulse`, 1,6 s). */
export function PulsoOpacidad({
  children,
  duracion = 1600,
  style,
}: {
  children: ReactNode;
  duracion?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: duracion / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t, duracion]);

  const estilo = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.55, 1]),
  }));

  return <Animated.View style={[estilo, style]}>{children}</Animated.View>;
}

/** Latido del corazón / la moneda en Afirmaciones (`afBeat`, 2,6 s). */
export function Latido({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.linear }),
      -1,
      false,
    );
  }, [t]);

  const estilo = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          t.value,
          [0, 0.12, 0.24, 0.36, 0.48, 1],
          [1, 1.09, 1, 1.06, 1, 1],
        ),
      },
    ],
  }));

  return <Animated.View style={[estilo, style]}>{children}</Animated.View>;
}
