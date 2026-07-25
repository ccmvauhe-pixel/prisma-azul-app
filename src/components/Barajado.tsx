/**
 * Barajeo 3D del mazo — usado en Cruz de Vida (palo oros) y en el Oráculo
 * (el palo del oráculo elegido).
 *
 * Porta `barajeo-3d.html` del handoff de animaciones. Detalle clave del original:
 * el desplazamiento del mazo y la animación viven en **elementos distintos**.
 * La carta externa lleva el apilado estático (`translate(-50%,-56%)`, la
 * profundidad `translateZ(i*2.4px)` y un giro leve alterno), y la interna lleva
 * los keyframes `pzShufL`/`pzShufR`. Así el mazo conserva su volumen mientras
 * las cartas saltan.
 */
import { useEffect, useId } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { DorsoNaipe, CARD_RATIO } from '@/components/Naipe';
import { layout, type Suit } from '@/theme/tokens';

const CARTAS = 8;
/** Medidas del original, sobre la columna de referencia de 430 px. */
const ANCHO_NAIPE_REF = 120;
const ESCENA_REF = { ancho: 260, alto: 250 };
/** `perspective: 850px` en el contenedor del original */
const PERSPECTIVA = 850;

/** Instantes de los keyframes (0 %, 12 %, 30 %, 46 %, 58 %, 100 %) */
const STOPS = [0, 0.12, 0.3, 0.46, 0.58, 1];

/** Valores de `pzShufR`; `pzShufL` es el mismo con la X invertida. */
const TRANSLATE_X = [0, 96, 40, 2, 0, 0];
const TRANSLATE_Y = [0, 8, -56, -8, 0, 0];
const ROTATE_Z = [0, 13, 5, 1, 0, 0];
const ROTATE_Y = [0, 30, 10, 0, 0, 0];
/**
 * `translateZ` no existe en React Native. La profundidad del keyframe
 * (0 → 40 → 86 → 18 px) se traduce a escala con la misma perspectiva del
 * original: escala = perspectiva / (perspectiva − z).
 */
const TRANSLATE_Z = [0, 40, 86, 18, 0, 0];
const SCALE = TRANSLATE_Z.map((z) => PERSPECTIVA / (PERSPECTIVA - z));

const EASING = Easing.bezier(0.45, 0.05, 0.3, 1);

/** Carta interna: solo la animación, como en el original. */
function CartaAnimada({
  index,
  duracion,
  desfase,
  escala,
  palo,
  variante,
  acento,
}: {
  index: number;
  duracion: number;
  desfase: number;
  escala: number;
  palo: Suit;
  variante: 'simple' | 'afirmacion';
  acento?: string;
}) {
  const t = useSharedValue(0);
  /** Las pares saltan a la derecha (`pzShufR`), las impares a la izquierda. */
  const dir = index % 2 ? -1 : 1;
  /** Profundidad de esta carta dentro del mazo en reposo (`translateZ(i*2.4px)`). */
  const profundidadBase = index * 2.4;

  useEffect(() => {
    const seg = (a: number, b: number) =>
      withTiming(b, { duration: duracion * (b - a), easing: EASING });

    const arranque = setTimeout(() => {
      t.value = withRepeat(
        withSequence(
          seg(0, 0.12),
          seg(0.12, 0.3),
          seg(0.3, 0.46),
          seg(0.46, 0.58),
          seg(0.58, 1),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      );
    }, desfase);

    return () => clearTimeout(arranque);
  }, [t, duracion, desfase]);

  const estilo = useAnimatedStyle(() => {
    const p = t.value;
    const z = interpolate(p, STOPS, TRANSLATE_Z);
    return {
      /*
       * CSS ordena las capas por profundidad real (`preserve-3d`); React Native
       * pinta en orden de montaje, así que la última carta taparía siempre a las
       * demás aunque otra volara por delante. Reponemos ese orden con el zIndex:
       * la profundidad del apilado más la del salto.
       */
      zIndex: Math.round(profundidadBase + z),
      transform: [
        { translateX: dir * interpolate(p, STOPS, TRANSLATE_X) * escala },
        { translateY: interpolate(p, STOPS, TRANSLATE_Y) * escala },
        { scale: interpolate(p, STOPS, SCALE) },
        { rotateZ: `${dir * interpolate(p, STOPS, ROTATE_Z)}deg` },
        { rotateY: `${dir * interpolate(p, STOPS, ROTATE_Y)}deg` },
      ],
    };
  });

  return (
    <Animated.View style={estilo}>
      <DorsoNaipe
        width={ANCHO_NAIPE_REF * escala}
        palo={palo}
        variante={variante}
        acento={acento}
        borderOpacity={0.35 + index * 0.06}
      />
    </Animated.View>
  );
}

/** Sombra elíptica que late bajo el mazo (`pzDeckShadow`). */
function Sombra({ escala }: { escala: number }) {
  const t = useSharedValue(0);
  const id = `sombra${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const ancho = 180 * escala;
  const alto = 140 * escala;

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [t]);

  const estilo = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.5, 0.72]),
    transform: [{ scale: interpolate(t.value, [0, 1], [1, 1.1]) }],
  }));

  return (
    <Animated.View
      style={[
        styles.sombra,
        { marginLeft: -ancho / 2, marginTop: -alto / 2 },
        estilo,
      ]}
      pointerEvents="none"
    >
      <Svg width={ancho} height={alto}>
        <Defs>
          <RadialGradient id={id}>
            <Stop offset="0" stopColor="#000" stopOpacity={0.5} />
            <Stop offset="0.68" stopColor="#000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse
          cx={ancho / 2}
          cy={alto / 2}
          rx={ancho / 2}
          ry={alto / 2}
          fill={`url(#${id})`}
        />
      </Svg>
    </Animated.View>
  );
}

export function Barajado({
  palo = 'oros',
  /** `ritual` = 1,1 s por ciclo; `ágil` = 0,85 s */
  ritmo = 'ritual',
  /** Dorso a usar. Afirmaciones tiene el suyo propio. */
  variante = 'simple',
  /** Color del brillo del emblema en la variante de Afirmaciones */
  acento,
}: {
  palo?: Suit;
  ritmo?: 'ritual' | 'ágil';
  variante?: 'simple' | 'afirmacion';
  acento?: string;
}) {
  const { width: ventana } = useWindowDimensions();
  const escala = Math.min(1, ventana / layout.maxWidth);

  const agil = ritmo === 'ágil';
  const duracion = agil ? 850 : 1100;
  const paso = agil ? 100 : 135;

  const anchoNaipe = ANCHO_NAIPE_REF * escala;
  const altoNaipe = anchoNaipe / CARD_RATIO;

  return (
    <View
      style={{
        width: ESCENA_REF.ancho * escala,
        height: ESCENA_REF.alto * escala,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Mesa inclinada: la perspectiva vive en el contenedor, como en el original */}
      <View style={styles.mesa}>
        <Sombra escala={escala} />
        {Array.from({ length: CARTAS }, (_, i) => (
          <View
            key={i}
            style={[
              styles.carta,
              {
                transform: [
                  // `translate(-50%,-56%)`: el centrado ya lo da el flexbox,
                  // queda el 6 % de desplazamiento vertical.
                  { translateY: -0.06 * altoNaipe },
                  // `translateZ(i*2.4px)` bajo la misma perspectiva
                  { scale: PERSPECTIVA / (PERSPECTIVA - i * 2.4) },
                  { rotateZ: `${(i % 2 ? 1 : -1) * (0.5 + i * 0.3)}deg` },
                ],
              },
            ]}
          >
            <CartaAnimada
              index={i}
              duracion={duracion}
              desfase={i * paso}
              escala={escala}
              palo={palo}
              variante={variante}
              acento={acento}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mesa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ perspective: PERSPECTIVA }, { rotateX: '30deg' }],
  },
  carta: { position: 'absolute' },
  sombra: { position: 'absolute', top: '60%', left: '50%' },
});
