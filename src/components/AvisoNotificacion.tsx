/**
 * Tarjeta de notificación de las pantallas bloqueadas: una maqueta del aviso que
 * llegará más el interruptor para activarlo o desactivarlo.
 *
 * A diferencia del prototipo (donde el interruptor era decorativo), aquí escribe
 * la preferencia real que `lib/notifications` usa para programar los avisos.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Emblem } from '@/components/Emblem';
import type { EmblemName } from '@/data/emblems';
import {
  color,
  creamDim,
  font,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

export function AvisoNotificacion({
  emblema = 'oros',
  cuando,
  mensaje,
  etiquetaToggle,
  activo,
  onToggle,
}: {
  emblema?: EmblemName;
  /** Momento mostrado en la maqueta, p. ej. "lunes 9:00" */
  cuando: string;
  mensaje: string;
  etiquetaToggle: string;
  activo: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.caja}>
      <View style={styles.fila}>
        <View style={styles.icono}>
          <Emblem name={emblema} size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.filaTitulo}>
            <Text style={styles.app}>Prisma Azul</Text>
            <Text style={styles.cuando}>{cuando}</Text>
          </View>
          <Text style={styles.mensaje}>{mensaje}</Text>
        </View>
      </View>

      <Pressable
        onPress={onToggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: activo }}
        style={styles.filaToggle}
      >
        <Text style={styles.etiqueta}>{etiquetaToggle}</Text>
        <Interruptor activo={activo} />
      </Pressable>
    </View>
  );
}

function Interruptor({ activo }: { activo: boolean }) {
  const perilla = (
    <View style={[styles.perilla, { left: activo ? 21 : 3 }]} />
  );

  if (activo) {
    return (
      <LinearGradient
        colors={[color.goldBright, color.goldDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pista}
      >
        {perilla}
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.pista, { backgroundColor: lavenderDim(0.25) }]}>
      {perilla}
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    width: '100%',
    borderWidth: 1,
    borderColor: lavenderDim(0.25),
    borderRadius: radius.inner,
    overflow: 'hidden',
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(21,13,52,.6)',
  },
  icono: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: goldDim(0.5),
    backgroundColor: '#150d34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  app: { fontFamily: font.sansBold, fontSize: 12.5, color: color.cream },
  cuando: { fontFamily: font.sans, fontSize: 11, color: lavenderDim(0.5) },
  mensaje: {
    fontFamily: font.sans,
    fontSize: 12.5,
    color: creamDim(0.85),
    marginTop: 1,
  },
  filaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: lavenderDim(0.15),
  },
  etiqueta: { fontFamily: font.sans, fontSize: 13.5, color: creamDim(0.9) },
  pista: {
    width: 46,
    height: 28,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  perilla: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.cream,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
