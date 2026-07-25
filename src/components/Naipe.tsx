/**
 * Naipe español. Porta el componente `Carta` del prototipo.
 *
 * El original medía todo en `cqw` (unidades de container query, 1cqw = 1 % del ancho
 * de la carta). Aquí se calcula igual: `u(n) = ancho * n / 100`, así la carta escala
 * igual a cualquier tamaño y conserva las proporciones del diseño.
 */
import { useId } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { Emblem } from '@/components/Emblem';
import { alpha, color, font, suitColor, suitIdxColor, type Suit } from '@/theme/tokens';

/** Relación de aspecto de todos los naipes del diseño */
export const CARD_RATIO = 5 / 7;

/** Nombre de la figura para las cartas de la corte */
export function rankName(num: number): string {
  return num === 10 ? 'Sota' : num === 11 ? 'Caballo' : num === 12 ? 'Rey' : '';
}

/** Nombre hablado del número, como lo usa la Cruz de Vida */
export function numName(num: number): string {
  const nombres: Record<number, string> = {
    1: 'As',
    2: 'Dos',
    3: 'Tres',
    4: 'Cuatro',
    5: 'Cinco',
    6: 'Seis',
    7: 'Siete',
    10: 'Diez',
    11: 'Caballo',
    12: 'Rey',
  };
  return nombres[num] ?? String(num);
}

export function paloName(palo: Suit): string {
  return palo.charAt(0).toUpperCase() + palo.slice(1);
}

/** "Caballo de Copas" */
export function nombreCarta(palo: Suit, num: number): string {
  return `${numName(num)} de ${paloName(palo)}`;
}

/** Disposición de los emblemas por número, copiada del prototipo (en % del área). */
const LAYOUTS: Record<number, [number, number][]> = {
  2: [[50, 20], [50, 80]],
  3: [[50, 15], [50, 50], [50, 85]],
  4: [[30, 22], [70, 22], [30, 78], [70, 78]],
  5: [[28, 20], [72, 20], [50, 50], [28, 80], [72, 80]],
  6: [[30, 16], [70, 16], [30, 50], [70, 50], [30, 84], [70, 84]],
  7: [[30, 15], [70, 15], [30, 46], [70, 46], [30, 84], [70, 84], [50, 32]],
};

const SIZE_BY_N: Record<number, number> = { 2: 25, 3: 21, 4: 20, 5: 18, 6: 16, 7: 15 };

/** Estrellitas de la textura del naipe (posición en % y opacidad) */
const TEXTURA: [number, number, string][] = [
  [20, 14, 'rgba(255,255,255,.8)'],
  [76, 22, 'rgba(255,255,255,.6)'],
  [38, 60, 'rgba(231,207,155,.6)'],
  [84, 76, 'rgba(255,255,255,.5)'],
  [14, 84, 'rgba(205,189,242,.6)'],
  [60, 40, 'rgba(255,255,255,.5)'],
];

type Props = {
  palo: Suit;
  num: number;
  /** Ancho del naipe en px; el alto sale de la proporción 5/7 */
  width: number;
  /** Oculta los índices de las esquinas */
  showIndex?: boolean;
};

export function Naipe({ palo, num, width, showIndex = true }: Props) {
  // Ids únicos por instancia: en web los SVG comparten el DOM (ver `Emblem`).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const idBg = `bg${uid}`;
  const idGlow = `glow${uid}`;

  const height = width / CARD_RATIO;
  /** 1 cqw del prototipo = 1 % del ancho de la carta */
  const u = (n: number) => (width * n) / 100;

  const main = suitColor[palo];
  const idxColor = suitIdxColor[palo];
  const gold = color.gold;

  const isAce = num === 1;
  const isCourt = num >= 10;
  const isPip = !isAce && !isCourt;

  const artTop = u(15);
  const artSide = u(11);
  const artW = width - artSide * 2;
  const artH = height - artTop * 2;

  const pips = isPip ? (LAYOUTS[num] ?? []) : [];
  const pipSize = u(SIZE_BY_N[num] ?? 18);

  return (
    <View style={{ width, height, borderRadius: u(5), overflow: 'hidden' }}>
      {/* Fondo radial + halo del color del palo */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={idBg} cx="50%" cy="-5%" rx="125%" ry="95%">
            <Stop offset="0" stopColor="#2a1f57" />
            <Stop offset="0.48" stopColor="#160e36" />
            <Stop offset="1" stopColor="#0b0726" />
          </RadialGradient>
          <RadialGradient id={idGlow}>
            <Stop offset="0" stopColor={main} stopOpacity={0.22} />
            <Stop offset="0.7" stopColor={main} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${idBg})`} />
        <Circle cx={width / 2} cy={height / 2} r={u(36)} fill={`url(#${idGlow})`} />
      </Svg>

      {/* Textura de estrellas */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}>
        {TEXTURA.map(([x, y, c], i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: c,
            }}
          />
        ))}
      </View>

      {/* Marco dorado exterior e interior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: u(3.5),
          left: u(3.5),
          right: u(3.5),
          bottom: u(3.5),
          borderWidth: u(1.1),
          borderColor: gold,
          borderRadius: u(4),
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: u(6),
          left: u(6),
          right: u(6),
          bottom: u(6),
          borderWidth: Math.max(StyleSheet.hairlineWidth, u(0.4)),
          borderColor: alpha(gold, 0.45),
          borderRadius: u(3),
        }}
      />

      {/* Zona de arte */}
      <View
        style={{
          position: 'absolute',
          top: artTop,
          left: artSide,
          width: artW,
          height: artH,
        }}
      >
        {isAce && (
          <>
            <View
              style={{
                position: 'absolute',
                left: artW / 2 - u(28),
                top: artH / 2 - u(28),
                width: u(56),
                height: u(56),
                borderRadius: u(28),
                borderWidth: Math.max(StyleSheet.hairlineWidth, u(0.5)),
                borderColor: alpha(gold, 0.5),
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: artW / 2 - u(20),
                top: artH / 2 - u(20),
                width: u(40),
                height: u(40),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Emblem name={palo} size={u(40)} />
            </View>
          </>
        )}

        {isPip &&
          pips.map(([x, y], i) => {
            const big = num === 5 && i === 2;
            const s = big ? pipSize + u(3) : pipSize;
            const invertido = y > 50;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: (artW * x) / 100 - s / 2,
                  top: (artH * y) / 100 - s / 2,
                  width: s,
                  height: s,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: invertido ? '180deg' : '0deg' }],
                }}
              >
                <Emblem name={palo} size={s} />
              </View>
            );
          })}

        {isCourt && (
          <>
            <View
              style={{
                position: 'absolute',
                left: artW / 2 - u(17),
                top: 0,
                width: u(34),
                alignItems: 'center',
              }}
            >
              <Emblem name="corona" size={u(34)} />
            </View>
            <View
              style={{
                position: 'absolute',
                left: artW / 2 - u(22),
                top: artH * 0.56 - u(22),
                width: u(44),
                height: u(44),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Emblem name={palo} size={u(44)} />
            </View>
            <Text
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -u(1),
                textAlign: 'center',
                fontFamily: font.serif,
                fontSize: u(8.5),
                letterSpacing: u(0.6),
                color: gold,
                textTransform: 'uppercase',
              }}
            >
              {rankName(num)}
            </Text>
          </>
        )}
      </View>

      {/* Índices de las esquinas: número + emblema, el inferior girado 180° */}
      {showIndex && (
        <>
          <View style={{ position: 'absolute', top: u(5.5), left: u(6.5), alignItems: 'center' }}>
            <Indice num={num} u={u} idxColor={idxColor} palo={palo} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: u(5.5),
              right: u(6.5),
              alignItems: 'center',
              transform: [{ rotate: '180deg' }],
            }}
          >
            <Indice num={num} u={u} idxColor={idxColor} palo={palo} />
          </View>
        </>
      )}
    </View>
  );
}

function Indice({
  num,
  u,
  idxColor,
  palo,
}: {
  num: number;
  u: (n: number) => number;
  idxColor: string;
  palo: Suit;
}) {
  return (
    <>
      <Text
        style={{
          fontFamily: font.serifBold,
          fontSize: u(12.5),
          lineHeight: u(12.5) * 1.05,
          color: idxColor,
        }}
      >
        {num}
      </Text>
      <View style={{ marginTop: u(1.2) }}>
        <Emblem name={palo} size={u(8.5)} />
      </View>
    </>
  );
}

/**
 * Dorso del naipe: degradado, tramado diagonal dorado/lavanda, marco interior
 * y el emblema del palo al centro.
 *
 * `variante="afirmacion"` reproduce el dorso propio de Afirmaciones que trae el
 * prototipo: doble marco, el emblema dentro de un círculo con brillo interior,
 * un ✦ arriba y el sello "AFIRMACIÓN" abajo.
 */
export function DorsoNaipe({
  width,
  palo = 'oros',
  borderOpacity = 0.6,
  variante = 'simple',
  acento,
}: {
  width: number;
  palo?: Suit;
  borderOpacity?: number;
  variante?: 'simple' | 'afirmacion';
  /** Color del brillo del emblema en la variante de Afirmaciones */
  acento?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const idDorso = `dorso${uid}`;

  const height = width / CARD_RATIO;
  const u = (n: number) => (width * n) / 100;
  /** El prototipo dibuja este dorso sobre una carta de 120 px; escalamos desde ahí. */
  const p = (n: number) => (width * n) / 120;

  // El tramado del prototipo (`repeating-linear-gradient` a ±45°) se dibuja aquí
  // como una rejilla de líneas finas giradas.
  const lineas = Math.ceil((width + height) / u(7));

  return (
    <View
      style={{
        width,
        height,
        borderRadius: u(8),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: alpha(color.gold, borderOpacity),
        backgroundColor: '#150d34',
      }}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={idDorso} cx="30%" cy="0%" rx="120%" ry="110%">
            <Stop offset="0" stopColor="#2a1f57" />
            <Stop offset="0.6" stopColor="#150d34" />
            <Stop offset="1" stopColor="#0b0726" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${idDorso})`} />
      </Svg>

      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}>
        {Array.from({ length: lineas }, (_, i) => (
          <View
            key={`a${i}`}
            style={{
              position: 'absolute',
              left: -height,
              top: i * u(7) - height,
              width: width + height * 2,
              height: 2,
              backgroundColor: 'rgba(231,207,155,.10)',
              transform: [{ rotate: '45deg' }],
            }}
          />
        ))}
        {Array.from({ length: lineas }, (_, i) => (
          <View
            key={`b${i}`}
            style={{
              position: 'absolute',
              left: -height,
              top: i * u(7) - height,
              width: width + height * 2,
              height: 2,
              backgroundColor: 'rgba(205,189,242,.08)',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        ))}
      </View>

      {/* Marco dorado interior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: variante === 'afirmacion' ? p(5) : u(6),
          left: variante === 'afirmacion' ? p(5) : u(6),
          right: variante === 'afirmacion' ? p(5) : u(6),
          bottom: variante === 'afirmacion' ? p(5) : u(6),
          borderWidth: 1.5,
          borderColor: 'rgba(231,207,155,.8)',
          borderRadius: variante === 'afirmacion' ? p(7) : u(6),
        }}
      />

      {variante === 'afirmacion' ? (
        <>
          {/* Segundo marco, más tenue */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: p(9),
              left: p(9),
              right: p(9),
              bottom: p(9),
              borderWidth: 1,
              borderColor: 'rgba(231,207,155,.35)',
              borderRadius: p(5),
            }}
          />

          {/* ✦ superior */}
          <Text
            style={{
              position: 'absolute',
              top: p(11),
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: p(9),
              lineHeight: p(11),
              color: 'rgba(231,207,155,.85)',
            }}
          >
            ✦
          </Text>

          {/* Emblema dentro del círculo con brillo interior */}
          <View
            style={{
              position: 'absolute',
              left: width / 2 - p(30),
              top: height * 0.46 - p(30),
              width: p(60),
              height: p(60),
              borderRadius: p(30),
              borderWidth: 1,
              borderColor: 'rgba(231,207,155,.65)',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#ecc874',
              shadowOpacity: 0.3,
              shadowRadius: p(9),
              shadowOffset: { width: 0, height: 0 },
            }}
          >
            <Emblem name={palo} size={p(30)} glow={acento ? `${acento}88` : undefined} />
          </View>

          {/* Sello inferior */}
          <Text
            style={{
              position: 'absolute',
              bottom: p(12),
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: font.sansSemi,
              fontSize: p(6.5),
              letterSpacing: p(2),
              textTransform: 'uppercase',
              color: 'rgba(231,207,155,.75)',
            }}
          >
            Afirmación
          </Text>
        </>
      ) : (
        <View
          style={{
            position: 'absolute',
            left: width * 0.24,
            top: height * 0.24,
            width: width * 0.52,
            height: width * 0.52,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Emblem name={palo} size={width * 0.52} />
        </View>
      )}
    </View>
  );
}
