/**
 * La Baraja — significados de las 40 cartas.
 *
 * Siempre disponible y sin temporizador. Dos vistas: la parrilla por palo y el
 * detalle de cada carta con pestañas General / Amor / Trabajo / Dinero, más las
 * secciones extra que traigan algunas cartas (Salud, Energía negativa).
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Emblem } from '@/components/Emblem';
import { Naipe, numName, rankName } from '@/components/Naipe';
import { Header, Screen } from '@/components/Screen';
import { BotonSecundario, PildoraInfo } from '@/components/ui';
import { CARTAS, PALOS } from '@/data/baraja';
import { anchoCelda, useAnchoContenido } from '@/lib/layout';
import {
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
  type Suit,
} from '@/theme/tokens';

/** La baraja española de 40 cartas: 1–7 más las tres figuras. */
const NUMEROS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

type Seleccion = { palo: Suit; num: number };

export default function LaBaraja() {
  const router = useRouter();
  // Parrilla de 3 columnas con 12 px de separación dentro del ancho disponible.
  const ancho = useAnchoContenido();
  const naipe = anchoCelda(ancho, 3, 12);
  const [palo, setPalo] = useState<Suit>('oros');
  const [sel, setSel] = useState<Seleccion | null>(null);
  const [tab, setTab] = useState('general');

  const paloDef = PALOS.find((p) => p.key === palo) ?? PALOS[0];

  function volver() {
    if (sel) setSel(null);
    else router.back();
  }

  return (
    <Screen>
      <Header
        kicker="Siempre disponible"
        titulo="La Baraja"
        onBack={volver}
        right={<PildoraInfo label="40 cartas" />}
      />

      {!sel ? (
        <>
          <Text style={styles.intro}>
            El significado de cada carta, tal como la lee Gilda. Toca una carta para
            conocerla.
          </Text>

          <View style={styles.tabsPalo}>
            {PALOS.map((p) => {
              const activo = p.key === palo;
              return (
                <Pressable
                  key={p.key}
                  onPress={() => setPalo(p.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activo }}
                  style={[styles.tabPalo, activo && styles.tabPaloActivo]}
                >
                  <Emblem name={p.key} size={26} glow={`${p.color}88`} />
                  <Text
                    style={[
                      styles.tabPaloLabel,
                      { color: activo ? color.gold : lavenderDim(0.65) },
                    ]}
                  >
                    {p.nombre}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.paloCabecera}>
            <Text style={styles.paloNombre}>{paloDef.nombre}</Text>
            <Text style={styles.paloElemento}>{paloDef.elemento}</Text>
          </View>

          <View style={styles.parrilla}>
            {NUMEROS.map((n) => (
              <Pressable
                key={n}
                onPress={() => {
                  setSel({ palo, num: n });
                  setTab('general');
                }}
                accessibilityRole="button"
                accessibilityLabel={`${numName(n)} de ${paloDef.nombre}`}
                style={({ pressed }) => [
                  styles.celda,
                  { width: naipe, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Naipe palo={palo} num={n} width={naipe} />
                <Text style={styles.celdaCaption}>
                  {numName(n)}
                  {rankName(n) ? ` · ${rankName(n)}` : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <DetalleCarta sel={sel} tab={tab} onTab={setTab} onVolver={() => setSel(null)} />
      )}
    </Screen>
  );
}

function DetalleCarta({
  sel,
  tab,
  onTab,
  onVolver,
}: {
  sel: Seleccion;
  tab: string;
  onTab: (t: string) => void;
  onVolver: () => void;
}) {
  const paloDef = PALOS.find((p) => p.key === sel.palo) ?? PALOS[0];
  const info = CARTAS[`${sel.palo}-${sel.num}`];

  const base = [
    { key: 'general', label: 'General' },
    { key: 'amor', label: 'Amor' },
    { key: 'trabajo', label: 'Trabajo' },
    { key: 'dinero', label: 'Dinero' },
  ];
  const extras = (info?.extras ?? []).map((e, i) => ({ key: `x${i}`, label: e.t }));
  const tabs = [...base, ...extras];

  const texto = tab.startsWith('x')
    ? (info?.extras?.[Number(tab.slice(1))]?.x ?? '')
    : ((info?.[tab as 'general' | 'amor' | 'trabajo' | 'dinero'] as string) ?? '');

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.detalleCabecera}>
        <Naipe palo={sel.palo} num={sel.num} width={108} />
        <View style={{ flex: 1 }}>
          <Text style={styles.detallePalo}>
            {paloDef.nombre} · {paloDef.elemento}
          </Text>
          <Text style={styles.detalleTitulo}>
            {sel.num} de {paloDef.nombre}
          </Text>
          {rankName(sel.num) ? (
            <Text style={styles.detalleRank}>
              {rankName(sel.num)} — figura de la corte
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Sin esto el ScrollView se estira a lo alto y arrastra a las pestañas.
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabs}
      >
        {tabs.map((t) => {
          const activo = tab === t.key;
          const etiqueta = (
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: activo ? color.onGold : lavenderDim(0.75) },
              ]}
            >
              {t.label}
            </Text>
          );

          return (
            <Pressable
              key={t.key}
              onPress={() => onTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activo }}
            >
              {activo ? (
                <LinearGradient
                  colors={[color.goldBright, color.goldDeep]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tab, styles.tabActivo]}
                >
                  {etiqueta}
                </LinearGradient>
              ) : (
                <View style={[styles.tab, styles.tabInactivo]}>{etiqueta}</View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.cajaTexto}>
        <Text style={styles.texto}>{texto}</Text>
      </View>

      <Text style={styles.nota}>La carta habla; tu intuición completa el mensaje.</Text>

      <View style={{ flex: 1, minHeight: 20 }} />
      <BotonSecundario style={{ marginTop: 24 }} onPress={onVolver}>
        Volver a la baraja
      </BotonSecundario>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    textAlign: 'center',
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: 22,
    color: lavenderDim(0.75),
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 16,
  },
  tabsPalo: { flexDirection: 'row', gap: 8, marginTop: 18 },
  tabPalo: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingTop: 11,
    paddingBottom: 9,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lavenderDim(0.18),
    backgroundColor: 'rgba(21,13,52,.4)',
  },
  tabPaloActivo: {
    borderColor: 'rgba(236,200,116,.85)',
    backgroundColor: 'rgba(236,200,116,.08)',
  },
  tabPaloLabel: { fontFamily: font.sansSemi, fontSize: 11 },

  paloCabecera: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 20,
    marginHorizontal: 2,
    marginBottom: 4,
  },
  paloNombre: { fontFamily: font.serif, fontSize: 24, color: color.gold },
  paloElemento: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
  },

  parrilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Centrado: las 40 cartas van de 10 en 10 por palo, así que la última fila
    // queda incompleta y sin esto se pegaría a la izquierda.
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 14,
    marginTop: 12,
  },
  celda: { alignItems: 'center' },
  celdaCaption: {
    fontFamily: font.sansMedium,
    fontSize: 11,
    color: goldDim(0.7),
    textAlign: 'center',
    marginTop: 6,
  },

  detalleCabecera: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    marginTop: 18,
  },
  detallePalo: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: lavenderDim(0.55),
  },
  detalleTitulo: {
    fontFamily: font.serif,
    fontSize: 32,
    lineHeight: 36,
    color: color.cream,
    marginTop: 4,
  },
  detalleRank: {
    fontFamily: font.sans,
    fontSize: 12,
    color: goldDim(0.8),
    marginTop: 4,
  },

  /** `flexGrow: 0` evita que el carrusel ocupe el alto sobrante de la columna. */
  tabsScroll: { flexGrow: 0, marginTop: 22 },
  tabs: {
    gap: 8,
    paddingBottom: 4,
    // Las pestañas conservan su alto natural en vez de estirarse.
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActivo: { borderColor: 'transparent' },
  tabInactivo: {
    backgroundColor: 'rgba(21,13,52,.5)',
    borderColor: lavenderDim(0.25),
  },
  tabLabel: { fontFamily: font.sansSemi, fontSize: 12.5 },

  cajaTexto: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: lavenderDim(0.2),
    borderRadius: radius.cardSmall,
    padding: 18,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  texto: {
    fontFamily: font.sans,
    fontSize: 14.5,
    lineHeight: 25,
    color: creamDim(0.92),
  },
  nota: {
    fontFamily: font.serifItalic,
    fontSize: 15,
    color: lavenderDim(0.65),
    marginTop: 16,
    textAlign: 'center',
  },
});
