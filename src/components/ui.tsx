/**
 * Piezas de UI compartidas: botones, píldoras de estado, tarjetas y toast.
 * Medidas y colores tomados del handoff (sección "Interactions & Behavior").
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import {
  cardBorder,
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

/**
 * Escala los botones al dispositivo: cómodos en móviles pequeños y claramente
 * más grandes en tablet, donde el dedo está más lejos y hay sitio de sobra.
 */
export function useMedidaBoton(base: number): { alto: number; fuente: number } {
  const { width, height } = useWindowDimensions();
  const menor = Math.min(width, height);
  const factor = menor >= 768 ? 1.25 : menor <= 360 ? 1 : 1.12;
  return {
    alto: Math.round(base * factor),
    fuente: Math.round(17 * factor * 10) / 10,
  };
}

/**
 * Botón primario: degradado dorado. El alto base del diseño es 54 px (44 dentro
 * de tarjetas) y se escala según el tamaño de pantalla.
 */
export function BotonPrimario({
  children,
  onPress,
  disabled,
  alto: altoBase = 60,
  style,
}: {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  alto?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { alto, fuente } = useMedidaBoton(altoBase);

  if (disabled) {
    return (
      <View
        style={[
          styles.btnBase,
          { height: alto, backgroundColor: 'rgba(205,189,242,.14)' },
          style,
        ]}
      >
        <Etiqueta fuente={fuente} color="rgba(205,189,242,.4)">
          {children}
        </Etiqueta>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}
    >
      <LinearGradient
        colors={[...color.goldButton]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.btnBase, styles.btnShadow, { height: alto }]}
      >
        <Etiqueta fuente={fuente} color={color.onGold}>
          {children}
        </Etiqueta>
      </LinearGradient>
    </Pressable>
  );
}

/**
 * Texto del botón. Va en una sola línea, con margen lateral para que nunca toque
 * el borde y encogiéndose si la etiqueta es larga, en vez de recortarse.
 */
function Etiqueta({
  children,
  fuente,
  color: c,
}: {
  children: string;
  fuente: number;
  color: string;
}) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      style={[
        styles.btnLabel,
        { fontSize: fuente, lineHeight: fuente * 1.3, color: c },
      ]}
    >
      {children}
    </Text>
  );
}

/** Botón secundario: contorno dorado sobre fondo transparente. */
export function BotonSecundario({
  children,
  onPress,
  alto: altoBase = 56,
  style,
}: {
  children: string;
  onPress: () => void;
  alto?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { alto, fuente } = useMedidaBoton(altoBase);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btnBase,
        {
          height: alto,
          borderWidth: 1,
          borderColor: goldDim(0.4),
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Etiqueta fuente={fuente - 1.5} color={color.gold}>
        {children}
      </Etiqueta>
    </Pressable>
  );
}

/**
 * Botón de guardar. Es la acción que decide si algo se conserva, así que va
 * deliberadamente más grande que el resto y ocupa todo el ancho de la columna.
 *
 * Solo se puede guardar una vez por entrega: al hacerlo lanza una celebración
 * (destello que barre el botón + chispas que salen despedidas) y después queda
 * apagado y sin pulsar. Vuelve a activarse solo cuando el temporizador se
 * renueva y llega una entrega nueva.
 */
export function BotonGuardar({
  children = 'Guardar',
  guardado,
  onPress,
  etiquetaGuardado = 'Guardado ✦',
  style,
}: {
  children?: string;
  /** true cuando la entrega actual ya se guardó */
  guardado: boolean;
  onPress: () => void;
  etiquetaGuardado?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { alto, fuente } = useMedidaBoton(72);
  const celebra = useSharedValue(0);
  const apagado = useSharedValue(guardado ? 1 : 0);
  const yaVenia = useRef(guardado);

  useEffect(() => {
    if (guardado && !yaVenia.current) {
      // Recién guardado: celebra y luego se apaga.
      celebra.value = 0;
      celebra.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) });
      apagado.value = withDelay(500, withTiming(1, { duration: 500 }));
    } else if (!guardado) {
      celebra.value = 0;
      apagado.value = withTiming(0, { duration: 300 });
    }
    yaVenia.current = guardado;
  }, [guardado, celebra, apagado]);

  /** El botón pierde color y se hunde ligeramente al quedar guardado. */
  const estiloApagado = useAnimatedStyle(() => ({
    opacity: 1 - apagado.value * 0.62,
  }));

  /** Destello que barre el botón de izquierda a derecha. */
  const estiloDestello = useAnimatedStyle(() => ({
    opacity: celebra.value > 0 && celebra.value < 1 ? 1 : 0,
    transform: [{ translateX: interpolate(celebra.value, [0, 1], [-260, 260]) }],
  }));

  const contenido = (
    <>
      <Animated.View style={estiloApagado}>
        <LinearGradient
          colors={[...color.goldButton]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btnBase, { height: alto }]}
        >
          <Etiqueta fuente={fuente} color={color.onGold}>
            {guardado ? etiquetaGuardado : children}
          </Etiqueta>
        </LinearGradient>
      </Animated.View>

      {/* Destello */}
      <View pointerEvents="none" style={styles.destelloRecorte}>
        <Animated.View style={[styles.destello, estiloDestello]} />
      </View>

      {/* Chispas que salen despedidas */}
      <Chispas progreso={celebra} />
    </>
  );

  if (guardado) {
    return (
      <View
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        accessibilityLabel={etiquetaGuardado}
        style={[styles.guardarWrap, style]}
      >
        {contenido}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.guardarWrap,
        styles.btnShadow,
        { opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {contenido}
    </Pressable>
  );
}

/** Ángulos fijos de las chispas: sin azar, para no depender del render. */
const CHISPAS = [-72, -40, -14, 14, 40, 72, -56, 56];

/** Chispas doradas que salen del botón al guardar y se apagan. */
function Chispas({ progreso }: { progreso: SharedValue<number> }) {
  return (
    <View pointerEvents="none" style={styles.chispasCapa}>
      {CHISPAS.map((angulo, i) => (
        <Chispa key={i} angulo={angulo} indice={i} progreso={progreso} />
      ))}
    </View>
  );
}

function Chispa({
  angulo,
  indice,
  progreso,
}: {
  angulo: number;
  indice: number;
  progreso: SharedValue<number>;
}) {
  const distancia = 46 + (indice % 3) * 16;
  const rad = (angulo * Math.PI) / 180;

  const estilo = useAnimatedStyle(() => {
    const p = progreso.value;
    // Salen despedidas y se apagan en el último tramo.
    const avance = interpolate(p, [0, 0.7, 1], [0, 1, 1]);
    return {
      opacity: p === 0 ? 0 : interpolate(p, [0, 0.15, 0.7, 1], [0, 1, 0.9, 0]),
      transform: [
        { translateX: Math.sin(rad) * distancia * avance },
        { translateY: -Math.cos(rad) * distancia * avance },
        { scale: interpolate(p, [0, 0.2, 1], [0.4, 1, 0.3]) },
        { rotate: `${angulo}deg` },
      ],
    };
  });

  return <Animated.View style={[styles.chispa, estilo]} />;
}

/**
 * Píldora de estado. `bloqueado` = contorno lavanda con la cuenta atrás;
 * disponible = degradado dorado con texto oscuro.
 */
export function Pildora({
  label,
  bloqueado,
  compacta,
}: {
  label: string;
  bloqueado: boolean;
  compacta?: boolean;
}) {
  const padding = compacta
    ? { paddingVertical: 4, paddingHorizontal: 9 }
    : { paddingVertical: 7, paddingHorizontal: 12 };
  const fontSize = compacta ? 10 : 11;

  if (bloqueado) {
    return (
      <View
        style={[
          styles.pill,
          padding,
          { borderWidth: 1, borderColor: lavenderDim(0.35) },
        ]}
      >
        <Text
          style={[styles.pillLabel, { fontSize, color: lavenderDim(0.75) }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[color.goldBright, color.goldDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.pill, padding]}
    >
      <Text
        style={[styles.pillLabel, { fontSize, color: color.onGold }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </LinearGradient>
  );
}

/** Píldora de contorno fijo usada en cabeceras ("40 cartas", "0 de 1 lecturas"). */
export function PildoraInfo({ label }: { label: string }) {
  return (
    <View style={[styles.pill, { paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderColor: goldDim(0.35) }]}>
      <Text style={[styles.pillLabel, { fontSize: 11, color: goldDim(0.85) }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Tarjeta estándar: radio 18–20, borde dorado tenue, fondo translúcido y
 * el acento lateral de 3 px (`inset 3px 0 0 <color>` en el diseño original).
 */
export function Tarjeta({
  children,
  acento,
  onPress,
  style,
}: {
  children: ReactNode;
  acento?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const contenido = (
    <>
      {acento ? (
        <View style={[styles.acento, { backgroundColor: acento }]} />
      ) : null}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.tarjeta, { opacity: pressed ? 0.85 : 1 }, style]}
      >
        {contenido}
      </Pressable>
    );
  }
  return <View style={[styles.tarjeta, style]}>{contenido}</View>;
}

/** Kicker: etiqueta corta en mayúsculas con mucho tracking. */
export function Kicker({
  children,
  style,
  color: c,
}: {
  children: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
}) {
  return (
    <Text
      style={[
        {
          fontFamily: font.sansSemi,
          fontSize: 10,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          color: c ?? lavenderDim(0.6),
        },
        style as never,
      ]}
    >
      {children}
    </Text>
  );
}

/** Aviso flotante superior; se muestra 2,2–2,4 s tras guardar o restablecer. */
export function Toast({ mensaje }: { mensaje: string | null }) {
  if (!mensaje) return null;
  return (
    <View pointerEvents="none" style={styles.toastWrap}>
      <View style={styles.toast}>
        <Text style={styles.toastText} numberOfLines={1}>
          {mensaje}
        </Text>
      </View>
    </View>
  );
}

/** Enlace discreto subrayado ("Restablecer (demo)"). */
export function EnlaceTenue({
  children,
  onPress,
}: {
  children: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.enlace}>
      <Text style={styles.enlaceTexto}>{children}</Text>
    </Pressable>
  );
}

/** Bloque "Cómo usarlo" / notas al pie con borde lavanda. */
export function NotaCaja({
  titulo,
  children,
  style,
}: {
  titulo: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.nota, style]}>
      <Kicker color={goldDim(0.75)} style={{ letterSpacing: 2 } as never}>
        {titulo}
      </Kicker>
      <View style={{ marginTop: 6 }}>{children}</View>
    </View>
  );
}

export const styles = StyleSheet.create({
  btnBase: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // Margen lateral para que la etiqueta nunca toque el borde redondeado.
    paddingHorizontal: 24,
  },
  btnShadow: {
    shadowColor: color.goldMid,
    shadowOpacity: 0.28,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  btnLabel: { fontFamily: font.sansBold, textAlign: 'center' },

  // — Botón de guardar y su celebración —
  guardarWrap: {
    width: '100%',
    borderRadius: radius.pill,
  },
  destelloRecorte: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  destello: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 70,
    backgroundColor: 'rgba(255,255,255,.5)',
    transform: [{ rotate: '18deg' }],
  },
  chispasCapa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chispa: {
    position: 'absolute',
    width: 7,
    height: 7,
    backgroundColor: '#f6e2a8',
    borderRadius: 1,
    shadowColor: '#f0d488',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  pill: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: { fontFamily: font.sansSemi },
  tarjeta: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: color.card,
    padding: 14,
    overflow: 'hidden',
  },
  acento: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  toastWrap: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 80,
  },
  toast: {
    backgroundColor: 'rgba(21,13,52,.95)',
    borderWidth: 1,
    borderColor: goldDim(0.5),
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  toastText: { fontFamily: font.sans, fontSize: 13, color: color.cream },
  enlace: { padding: 10, alignSelf: 'center' },
  enlaceTexto: {
    fontFamily: font.sans,
    fontSize: 12,
    color: lavenderDim(0.5),
    textDecorationLine: 'underline',
  },
  nota: {
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    borderRadius: radius.inner,
    padding: 14,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  notaTexto: {
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 21,
    color: creamDim(0.88),
  },
});
