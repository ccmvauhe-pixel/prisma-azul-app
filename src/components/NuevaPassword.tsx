/**
 * Elegir contraseña nueva tras abrir el enlace de recuperación.
 *
 * Es una compuerta, no una ruta: al canjear el enlace Supabase ya deja la
 * sesión iniciada, así que sin esta pantalla la persona entraría a la app sin
 * llegar a cambiar nada — y volvería a quedarse fuera la próxima vez.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CampoPassword } from '@/components/CampoPassword';
import { Emblem } from '@/components/Emblem';
import { PulsoBrillo } from '@/components/PulsoBrillo';
import { Screen } from '@/components/Screen';
import { EnlaceTenue, Toast } from '@/components/ui';
import { cerrarSesion, terminarRecuperacion, useSesion } from '@/lib/auth';
import { color, font, fs, goldDim, lavenderDim } from '@/theme/tokens';

export function NuevaPassword() {
  const sesion = useSesion();
  const [toast, setToast] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  /*
   * Una cuenta sin correo es una cuenta anónima, y esas viven solo en este
   * teléfono: cerrar sesión no es "salir", es borrarla para siempre junto con
   * todo lo guardado. Por eso aquí se pregunta dos veces y en la de arriba no.
   *
   * Con una cuenta de correo no hay nada que perder: se sale y ya.
   */
  const esAnonima = !sesion?.user.email || sesion.user.is_anonymous === true;

  function salir() {
    if (esAnonima && !confirmando) {
      setConfirmando(true);
      return;
    }
    void (async () => {
      await cerrarSesion();
      terminarRecuperacion();
    })();
  }

  return (
    <Screen>
      <View style={styles.centro}>
        <PulsoBrillo style={{ borderRadius: 44 }}>
          <View style={styles.circulo}>
            <Emblem name="oros" size={42} glow="rgba(236,200,116,.5)" />
          </View>
        </PulsoBrillo>

        <Text style={styles.marca}>Prisma Azul</Text>
        <Text style={styles.titulo}>Elige tu contraseña</Text>
        <Text style={styles.sub}>
          {sesion?.user.email
            ? `Estás entrando como ${sesion.user.email}. Elige una contraseña nueva para volver a tener acceso.`
            : 'Elige una contraseña nueva para volver a tener acceso.'}
        </Text>

        <View style={{ width: '100%', marginTop: 22 }}>
          <CampoPassword
            autoFocus
            etiquetaBoton="Guardar y entrar"
            onListo={() => {
              setToast('✨ Contraseña actualizada');
              // Un respiro para que el aviso se lea antes de pasar a la app.
              setTimeout(() => terminarRecuperacion(), 900);
            }}
          />
        </View>

        {confirmando ? (
          <Text style={styles.aviso}>
            Tu cuenta vive solo en este teléfono y no tiene contraseña: al salir
            se pierde, con todo lo que hayas guardado. Vuelve a pulsar si aun
            así quieres salir.
          </Text>
        ) : null}

        <EnlaceTenue onPress={salir}>
          {confirmando ? 'Sí, salir y perder mi cuenta' : 'Cancelar y salir'}
        </EnlaceTenue>
      </View>

      <Toast mensaje={toast} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 30,
  },
  circulo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  marca: {
    fontFamily: font.sansSemi,
    fontSize: fs(11),
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: lavenderDim(0.6),
    marginTop: 20,
  },
  titulo: {
    fontFamily: font.serif,
    fontSize: fs(32),
    lineHeight: fs(38),
    color: color.gold,
    textAlign: 'center',
    marginTop: 4,
  },
  sub: {
    fontFamily: font.sans,
    fontSize: fs(13.5),
    lineHeight: fs(22),
    color: lavenderDim(0.78),
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 320,
  },
  aviso: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    lineHeight: fs(19),
    color: '#e79ab4',
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },
});
