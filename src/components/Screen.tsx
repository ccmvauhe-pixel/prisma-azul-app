/**
 * Marco común de todas las pantallas: degradado de escena, estrellas y la
 * columna centrada de 430 px de ancho máximo del diseño.
 */
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, layout, lavenderDim } from '@/theme/tokens';

/**
 * Posiciones de las estrellitas, tomadas de los `radial-gradient` del prototipo
 * (porcentajes sobre el alto/ancho de la pantalla).
 */
const ESTRELLAS: { left: string; top: string; size: number; color: string }[] = [
  { left: '12%', top: '3%', size: 1.4, color: 'rgba(255,255,255,.9)' },
  { left: '28%', top: '7%', size: 1, color: 'rgba(231,207,155,.7)' },
  { left: '62%', top: '2.5%', size: 1.4, color: 'rgba(255,255,255,.7)' },
  { left: '82%', top: '5.5%', size: 1, color: 'rgba(205,189,242,.8)' },
  { left: '92%', top: '12%', size: 1, color: 'rgba(255,255,255,.6)' },
  { left: '44%', top: '16%', size: 1, color: 'rgba(255,255,255,.5)' },
  { left: '6%', top: '22%', size: 1, color: 'rgba(231,207,155,.6)' },
  { left: '70%', top: '26%', size: 1, color: 'rgba(205,189,242,.5)' },
  { left: '24%', top: '33%', size: 1, color: 'rgba(255,255,255,.5)' },
  { left: '88%', top: '41%', size: 1, color: 'rgba(255,255,255,.45)' },
  { left: '16%', top: '52%', size: 1, color: 'rgba(231,207,155,.5)' },
  { left: '58%', top: '61%', size: 1, color: 'rgba(205,189,242,.45)' },
  { left: '34%', top: '73%', size: 1, color: 'rgba(255,255,255,.4)' },
  { left: '78%', top: '84%', size: 1, color: 'rgba(255,255,255,.4)' },
];

function Estrellas() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.7 }]}>
      {ESTRELLAS.map((e, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: e.left as ViewStyle['left'],
            top: e.top as ViewStyle['top'],
            width: e.size * 2,
            height: e.size * 2,
            borderRadius: e.size,
            backgroundColor: e.color,
          }}
        />
      ))}
    </View>
  );
}

type ScreenProps = {
  children: ReactNode;
  /** Sin scroll para las vistas que se ajustan a la altura (barajado, etc.) */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + 18,
    paddingBottom: insets.bottom + 34,
    paddingHorizontal: layout.screenPaddingH,
  };

  const inner = (
    <View style={[styles.column, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...color.scene]}
        locations={[0, 0.46, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Estrellas />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, padding]}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={[styles.scrollContent, padding, { flex: 1 }]}>{inner}</View>
      )}
    </View>
  );
}

/** Cabecera con "‹", kicker, título y píldora opcional a la derecha. */
export function Header({
  kicker,
  titulo,
  onBack,
  right,
}: {
  kicker: string;
  titulo: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={styles.backBtn}
      >
        <Text style={styles.backChevron}>‹</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.headerTitle}>{titulo}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.base },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  column: { width: '100%', maxWidth: layout.maxWidth, flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  backBtn: {
    width: 44,
    height: 44,
    marginLeft: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    fontFamily: font.serif,
    fontSize: 30,
    lineHeight: 34,
    color: 'rgba(231,207,155,.85)',
  },
  kicker: {
    fontFamily: font.sansSemi,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: lavenderDim(0.6),
  },
  headerTitle: {
    fontFamily: font.serif,
    fontSize: 26,
    lineHeight: 30,
    color: color.gold,
  },
});
