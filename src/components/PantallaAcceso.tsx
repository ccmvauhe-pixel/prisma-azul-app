/**
 * Acceso: crear cuenta o entrar, con correo y contraseña.
 *
 * ⚠️ ESTA PANTALLA NO ESTÁ CONECTADA, Y NO SE CONECTA SOLA.
 *
 * Hoy no la importa nadie: el acceso real es anónimo y automático
 * (`entrarAnonimo`, llamado desde `_layout.tsx`). Basta un `import` para
 * enchufarla, y ahí está el peligro — el resguardo que hace falta vive en
 * `supabase/config.toml`, que es un archivo que nadie abre mientras escribe una
 * pantalla. De ahí este aviso, puesto donde sí se va a leer.
 *
 * El día que se conecte, EN EL MISMO COMMIT hacen falta las tres cosas:
 *
 *   1. `[auth.captcha]` en `supabase/config.toml` (hoy comentado). Necesita
 *      cuenta de Cloudflare o hCaptcha y el secreto por variable de entorno.
 *   2. `[auth.email] enable_signup = true` (hoy en `false`, cerrado a
 *      propósito por la auditoría).
 *   3. `options: { captchaToken }` en `signUp`, `signInWithPassword` y
 *      `resetPasswordForEmail`, dentro de `auth.ts`.
 *
 * Las tres a la vez, ni antes ni después. Activar el 1 sin el 3 rechaza TODA
 * petición de auth —incluida `signInAnonymously`, que es el arranque— y la app
 * no abre. Conectar esto con el 2 abierto y sin el 1 deja el relleno de
 * credenciales frenado solo por 30 intentos / 5 min por IP, que se reparte
 * entre IPs por cuatro duros.
 *
 * El enlace mágico no desapareció — sigue siendo el camino para recuperar la
 * contraseña, y `procesarEnlace` en `auth.ts` es quien lo recoge.
 *
 * El handoff de diseño no incluye esta pantalla, así que está armada con las
 * mismas piezas y tokens que el resto para que no desentone.
 *
 * Vive en `components/` y no en `app/` a propósito: es una compuerta que
 * `_layout` muestra antes de la navegación, no una ruta. Todo lo que cae en
 * `app/` se convierte en ruta y no puede recibir props.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Emblem } from '@/components/Emblem';
import { PulsoBrillo } from '@/components/PulsoBrillo';
import { Screen } from '@/components/Screen';
import { BotonPrimario, EnlaceTenue, Toast } from '@/components/ui';
import { entrar, recuperarPassword, registrar } from '@/lib/auth';
import {
  cardBorder,
  color,
  creamDim,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
} from '@/theme/tokens';

type Modo = 'entrar' | 'crear' | 'recuperar';

export function PantallaAcceso({ onOmitir }: { onOmitir?: () => void }) {
  const [modo, setModo] = useState<Modo>('crear');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const esCrear = modo === 'crear';
  const esRecuperar = modo === 'recuperar';

  function cambiarModo(m: Modo) {
    setModo(m);
    setError(null);
    setEnviado(false);
  }

  async function enviar() {
    if (ocupado) return;
    setError(null);
    setOcupado(true);
    try {
      if (esRecuperar) {
        await recuperarPassword(email);
        setEnviado(true);
        setToast('✨ Te enviamos un enlace');
        setTimeout(() => setToast(null), 2400);
      } else if (esCrear) {
        await registrar(nombre, email, password);
      } else {
        await entrar(email, password);
      }
      // Al entrar o registrarse, `_layout` reacciona a la sesión: aquí no hay
      // que navegar a ningún sitio.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo salió mal.');
    } finally {
      setOcupado(false);
    }
  }

  const listo = esRecuperar
    ? email.trim().length > 0
    : esCrear
      ? nombre.trim().length > 1 && email.trim().length > 0 && password.length >= 8
      : email.trim().length > 0 && password.length > 0;

  return (
    <Screen>
      <View style={styles.centro}>
        <PulsoBrillo style={{ borderRadius: 44 }}>
          <View style={styles.circulo}>
            <Emblem name="corona" size={44} glow="rgba(236,200,116,.5)" />
          </View>
        </PulsoBrillo>

        <Text style={styles.marca}>Prisma Azul</Text>
        <Text style={styles.titulo}>
          {esRecuperar ? 'Recuperar acceso' : esCrear ? 'Guarda tu camino' : 'Bienvenida de nuevo'}
        </Text>
        <Text style={styles.sub}>
          {esRecuperar
            ? 'Te enviaremos un enlace para volver a entrar y elegir una contraseña nueva.'
            : esCrear
              ? 'Crea tu cuenta para que tus lecturas te acompañen aunque cambies de teléfono.'
              : 'Entra para recuperar todo lo que has guardado.'}
        </Text>

        {!esRecuperar ? (
          <View style={styles.pestanas}>
            {(['crear', 'entrar'] as const).map((m) => {
              const activo = modo === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => cambiarModo(m)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activo }}
                  style={[styles.pestana, activo && styles.pestanaActiva]}
                >
                  <Text style={[styles.pestanaTexto, activo && styles.pestanaTextoActivo]}>
                    {m === 'crear' ? 'Crear cuenta' : 'Ya tengo cuenta'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {esCrear ? (
          <TextInput
            value={nombre}
            onChangeText={(t) => {
              setNombre(t);
              if (error) setError(null);
            }}
            placeholder="Tu nombre"
            placeholderTextColor={lavenderDim(0.4)}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="givenName"
            // Los mismos topes que las restricciones CHECK de `perfiles`.
            maxLength={80}
            editable={!ocupado}
            accessibilityLabel="Tu nombre"
            style={styles.campo}
          />
        ) : null}

        <TextInput
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor={lavenderDim(0.4)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          editable={!ocupado}
          accessibilityLabel="Tu correo electrónico"
          style={[styles.campo, !!error && styles.campoError]}
        />

        {!esRecuperar ? (
          <TextInput
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (error) setError(null);
            }}
            placeholder={esCrear ? 'Contraseña (mínimo 8)' : 'Contraseña'}
            placeholderTextColor={lavenderDim(0.4)}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={esCrear ? 'new-password' : 'current-password'}
            textContentType={esCrear ? 'newPassword' : 'password'}
            editable={!ocupado}
            returnKeyType="go"
            onSubmitEditing={() => void enviar()}
            accessibilityLabel="Tu contraseña"
            style={[styles.campo, !!error && styles.campoError]}
          />
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {esRecuperar && enviado ? (
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>
              Revisa tu correo y abre el enlace{' '}
              <Text style={styles.avisoFuerte}>en este mismo teléfono</Text>.
            </Text>
          </View>
        ) : null}

        <BotonPrimario
          style={{ marginTop: 18, width: '100%' }}
          disabled={ocupado || !listo}
          onPress={() => void enviar()}
        >
          {ocupado
            ? 'Un momento…'
            : esRecuperar
              ? 'Enviarme el enlace'
              : esCrear
                ? 'Crear mi cuenta'
                : 'Entrar'}
        </BotonPrimario>

        {!esRecuperar ? (
          <EnlaceTenue onPress={() => cambiarModo('recuperar')}>
            Olvidé mi contraseña
          </EnlaceTenue>
        ) : (
          <EnlaceTenue onPress={() => cambiarModo('entrar')}>Volver</EnlaceTenue>
        )}

        {onOmitir ? (
          <EnlaceTenue onPress={onOmitir}>Ahora no, seguir sin guardar</EnlaceTenue>
        ) : null}
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

  pestanas: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    width: '100%',
  },
  pestana: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    backgroundColor: 'rgba(21,13,52,.45)',
    alignItems: 'center',
  },
  pestanaActiva: {
    borderColor: 'rgba(236,200,116,.85)',
    backgroundColor: 'rgba(236,200,116,.08)',
  },
  pestanaTexto: {
    fontFamily: font.sansSemi,
    fontSize: fs(12.5),
    color: lavenderDim(0.7),
  },
  pestanaTextoActivo: { color: color.gold },

  campo: {
    width: '100%',
    marginTop: 12,
    height: 54,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: 'rgba(21,13,52,.5)',
    paddingHorizontal: 18,
    fontFamily: font.sans,
    fontSize: fs(15.5),
    color: color.cream,
  },
  campoError: { borderColor: 'rgba(231,154,180,.9)' },
  error: {
    fontFamily: font.sans,
    fontSize: fs(12.5),
    lineHeight: fs(19),
    color: '#e79ab4',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
  },
  aviso: {
    width: '100%',
    marginTop: 16,
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    borderRadius: radius.inner,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  avisoTexto: {
    fontFamily: font.sans,
    fontSize: fs(13),
    lineHeight: fs(21),
    color: creamDim(0.88),
    textAlign: 'center',
  },
  avisoFuerte: { fontFamily: font.sansBold, color: color.gold },
});
