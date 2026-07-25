/**
 * Selección en abanico del Oráculo.
 *
 * Porta `oraculo-seleccion.html`. Lo característico frente a un abanico normal:
 * al elegir una carta esta **vuela hacia adelante** a una fila superior, y el
 * abanico **se cierra sobre el hueco** — los ángulos se recalculan solo sobre las
 * cartas que quedan, no sobre las 12 originales. Volver a tocar una elegida la
 * devuelve al abanico. Máximo 3.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DorsoNaipe, CARD_RATIO } from '@/components/Naipe';
import { layout, type Suit } from '@/theme/tokens';

const TOTAL = 12;
const MAX_ELEGIDAS = 3;

/** Medidas del original */
const ANCHO_CARTA_REF = 74;
const ESCENA_REF = { ancho: 360, alto: 250 };
const ANGULO = 46;
/** `transform-origin: 50% 118%` — el pivote cae bajo la carta */
const ORIGEN_Y = 1.18;
/** Salto de las elegidas y separación entre ellas */
const SUBIDA_REF = 152;
const SEPARACION_REF = 88;
/** `translateZ(80px)` con `perspective: 750px` */
const PERSPECTIVA = 750;
const ESCALA_ELEGIDA = 1.12 * (PERSPECTIVA / (PERSPECTIVA - 80));

const DURACION = 550;
const EASING = Easing.bezier(0.25, 0.8, 0.25, 1.05);

type Props = {
  palo: Suit;
  elegidas: number[];
  onToggle: (i: number) => void;
};

export function AbanicoOraculo({ palo, elegidas, onToggle }: Props) {
  const { width: ventana } = useWindowDimensions();
  const escala = Math.min(1, ventana / layout.maxWidth);

  const ancho = ANCHO_CARTA_REF * escala;
  const alto = ancho / CARD_RATIO;

  /** Índices que siguen en el abanico, en orden. Define cómo se cierra el hueco. */
  const restantes = Array.from({ length: TOTAL }, (_, i) => i).filter(
    (i) => !elegidas.includes(i),
  );

  return (
    <View
      style={{
        width: ESCENA_REF.ancho * escala,
        maxWidth: '100%',
        height: ESCENA_REF.alto * escala,
        alignSelf: 'center',
      }}
    >
      {Array.from({ length: TOTAL }, (_, i) => {
        const orden = elegidas.indexOf(i);
        const elegida = orden >= 0;
        const pos = restantes.indexOf(i);
        // El ángulo se reparte solo entre las cartas que quedan: el abanico se cierra.
        const angulo =
          restantes.length > 1
            ? -ANGULO + pos * ((ANGULO * 2) / (restantes.length - 1))
            : 0;

        return (
          <CartaAbanico
            key={i}
            ancho={ancho}
            alto={alto}
            escala={escala}
            palo={palo}
            elegida={elegida}
            orden={orden}
            angulo={angulo}
            zIndex={elegida ? 40 + orden : pos}
            deshabilitada={!elegida && elegidas.length >= MAX_ELEGIDAS}
            onPress={() => onToggle(i)}
          />
        );
      })}
    </View>
  );
}

function CartaAbanico({
  ancho,
  alto,
  escala,
  palo,
  elegida,
  orden,
  angulo,
  zIndex,
  deshabilitada,
  onPress,
}: {
  ancho: number;
  alto: number;
  escala: number;
  palo: Suit;
  elegida: boolean;
  orden: number;
  angulo: number;
  zIndex: number;
  deshabilitada: boolean;
  onPress: () => void;
}) {
  const t = useSharedValue(elegida ? 1 : 0);
  const giro = useSharedValue(angulo);
  const desplazamiento = useSharedValue(orden >= 0 ? (orden - 1) * SEPARACION_REF : 0);

  useEffect(() => {
    const opciones = { duration: DURACION, easing: EASING };
    t.value = withTiming(elegida ? 1 : 0, opciones);
    giro.value = withTiming(angulo, opciones);
    if (elegida) desplazamiento.value = withTiming((orden - 1) * SEPARACION_REF, opciones);
  }, [elegida, angulo, orden, t, giro, desplazamiento]);

  const estilo = useAnimatedStyle(() => {
    const e = t.value;
    // El pivote del abanico está bajo la carta: se baja, se gira y se vuelve a subir.
    const pivote = alto * (ORIGEN_Y - 0.5);
    return {
      transform: [
        { translateX: desplazamiento.value * escala * e },
        { translateY: pivote },
        { rotateZ: `${giro.value * (1 - e)}deg` },
        { translateY: -pivote },
        { translateY: -SUBIDA_REF * escala * e },
        { scale: 1 + (ESCALA_ELEGIDA - 1) * e },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.carta,
        { width: ancho, height: alto, marginLeft: -ancho / 2, zIndex },
        estilo,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={deshabilitada}
        accessibilityRole="button"
        accessibilityState={{ selected: elegida }}
        style={[
          styles.pulsable,
          elegida ? styles.brilloElegida : styles.sombraNormal,
        ]}
      >
        <DorsoNaipe width={ancho} palo={palo} borderOpacity={elegida ? 0.95 : 0.45} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carta: { position: 'absolute', bottom: 0, left: '50%' },
  pulsable: { borderRadius: 8 },
  brilloElegida: {
    shadowColor: '#ecc874',
    shadowOpacity: 0.65,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  sombraNormal: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
