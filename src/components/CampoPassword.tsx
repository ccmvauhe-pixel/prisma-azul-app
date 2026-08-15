/**
 * Par de campos para elegir una contraseña nueva, con su validación.
 *
 * Vive aparte porque se usa en dos sitios muy distintos: la pantalla a la que
 * lleva el enlace de recuperación, y el bloque de seguridad del perfil. Tener
 * una sola pieza evita que las reglas se separen con el tiempo.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cambiarPassword } from '@/lib/auth';
import {
  cardBorder,
  color,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

/** Mínimo real, no decorativo: por debajo de esto Supabase también rechaza. */
export const MINIMO = 8;

export function CampoPassword({
  onListo,
  etiquetaBoton = 'Guardar contraseña',
  autoFocus = false,
}: {
  onListo: () => void;
  etiquetaBoton?: string;
  autoFocus?: boolean;
}) {
  const [password, setPassword] = useState('');
  const [repetida, setRepetida] = useState('');
  const [visible, setVisible] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cortaAun = password.length > 0 && password.length < MINIMO;
  const noCoinciden = repetida.length > 0 && password !== repetida;
  const listo = password.length >= MINIMO && password === repetida;

  async function guardar() {
    if (ocupado || !listo) return;
    setError(null);
    setOcupado(true);
    try {
      await cambiarPassword(password);
      setPassword('');
      setRepetida('');
      onListo();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <View style={{ width: '100%' }}>
      <View>
        <TextInput
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) setError(null);
          }}
          placeholder={`Contraseña nueva (mínimo ${MINIMO})`}
          placeholderTextColor={lavenderDim(0.4)}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          editable={!ocupado}
          autoFocus={autoFocus}
          accessibilityLabel="Contraseña nueva"
          style={[styles.campo, cortaAun && styles.campoAviso]}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          hitSlop={10}
          style={styles.ojo}
        >
          <Text style={styles.ojoTexto}>{visible ? 'Ocultar' : 'Ver'}</Text>
        </Pressable>
      </View>

      <TextInput
        value={repetida}
        onChangeText={(t) => {
          setRepetida(t);
          if (error) setError(null);
        }}
        placeholder="Repítela"
        placeholderTextColor={lavenderDim(0.4)}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        editable={!ocupado}
        returnKeyType="go"
        onSubmitEditing={() => void guardar()}
        accessibilityLabel="Repite la contraseña"
        style={[styles.campo, noCoinciden && styles.campoAviso]}
      />

      {/* Un solo mensaje a la vez, y solo cuando ya hay algo que decir. */}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : noCoinciden ? (
        <Text style={styles.error}>Las dos contraseñas no coinciden.</Text>
      ) : cortaAun ? (
        <Text style={styles.pista}>Te faltan {MINIMO - password.length} caracteres.</Text>
      ) : null}

      <Pressable
        onPress={() => void guardar()}
        disabled={ocupado || !listo}
        accessibilityRole="button"
        style={[styles.boton, (!listo || ocupado) && styles.botonApagado]}
      >
        <Text style={[styles.botonTexto, (!listo || ocupado) && styles.botonTextoApagado]}>
          {ocupado ? 'Guardando…' : etiquetaBoton}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    width: '100%',
    marginTop: 10,
    height: 52,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: 'rgba(10,7,32,.5)',
    paddingHorizontal: 16,
    paddingRight: 74,
    fontFamily: font.sans,
    fontSize: fs(15),
    color: color.cream,
  },
  campoAviso: { borderColor: 'rgba(231,154,180,.85)' },
  ojo: {
    position: 'absolute',
    right: 14,
    top: 10,
    height: 52,
    justifyContent: 'center',
  },
  ojoTexto: {
    fontFamily: font.sansSemi,
    fontSize: fs(12),
    color: goldDim(0.85),
  },
  error: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    lineHeight: fs(19),
    color: '#e79ab4',
    marginTop: 9,
  },
  pista: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    lineHeight: fs(19),
    color: lavenderDim(0.6),
    marginTop: 9,
  },
  boton: {
    marginTop: 14,
    height: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: goldDim(0.6),
    backgroundColor: 'rgba(236,200,116,.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonApagado: { borderColor: lavenderDim(0.2), backgroundColor: 'transparent' },
  botonTexto: { fontFamily: font.sansSemi, fontSize: fs(14.5), color: color.gold },
  botonTextoApagado: { color: lavenderDim(0.45) },
});
