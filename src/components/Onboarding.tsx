/**
 * Onboarding: se muestra una sola vez, la primera vez que se abre la app.
 *
 * Cuatro datos, en tres pasos:
 *  1. Nombre y correo — sin contraseña, sin confirmación, sin esperas.
 *  2. Qué desea manifestar — un cuestionario corto cuyo único fin es medir. No
 *     cambia lo que la app muestra, a propósito: si el orden de las secciones
 *     dependiera de la respuesta, los datos de uso quedarían sesgados por esa
 *     misma decisión y ya no dirían qué busca la gente de verdad.
 *  3. Cumpleaños — para la demografía y para no dejar entrar a menores de 13,
 *     que es el umbral que exigen las tiendas de aplicaciones.
 *
 * Nada de esto pide credenciales: la sesión ya está abierta por detrás y es
 * invisible. Ahí se apoya RLS para saber de quién es cada fila, y es también lo
 * que permitirá añadir contraseña más adelante sin que nadie pierda sus datos.
 *
 * Vive en `components/` porque es una compuerta, no una ruta.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Emblem } from '@/components/Emblem';
import { Screen } from '@/components/Screen';
import { BotonPrimario, EnlaceTenue } from '@/components/ui';
import { correoValido } from '@/lib/auth';
import {
  EDAD_MINIMA,
  INTERESES,
  actualizarPerfil,
  edadDe,
  usePerfil,
  type InteresKey,
} from '@/lib/perfil';
import {
  cardBorder,
  color,
  creamDim,
  font,
  fs,
  goldDim,
  lavenderDim,
  radius,
  text,
} from '@/theme/tokens';

type Paso = 'identidad' | 'nacimiento' | 'intereses' | 'bloqueado';

export function Onboarding() {
  const perfil = usePerfil();
  const [paso, setPaso] = useState<Paso>('identidad');
  const [nombreCampo, setNombreCampo] = useState('');
  const [correoCampo, setCorreoCampo] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [elegidos, setElegidos] = useState<InteresKey[]>([]);
  const [principal, setPrincipal] = useState<InteresKey | null>(null);
  const [guardando, setGuardando] = useState(false);

  const nombre = perfil?.nombre?.trim() ?? nombreCampo.trim();

  function continuarIdentidad() {
    const n = nombreCampo.trim();
    const c = correoCampo.trim().toLowerCase();
    if (n.length < 2) {
      setError('Escribe tu nombre.');
      return;
    }
    if (!correoValido(c)) {
      setError('Ese correo no parece válido.');
      return;
    }
    setError(null);
    void actualizarPerfil({ nombre: n, correo: c });
    setPaso('intereses');
  }

  function continuarNacimiento() {
    const d = Number(dia);
    const m = Number(mes);
    const a = Number(anio);

    if (!d || !m || !a || anio.length !== 4) {
      setError('Escribe tu fecha completa.');
      return;
    }
    if (d < 1 || d > 31 || m < 1 || m > 12) {
      setError('Esa fecha no existe.');
      return;
    }

    const iso = `${a}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const fecha = new Date(`${iso}T00:00:00`);
    // Comprobar los componentes descarta fechas como el 31 de febrero, que
    // JavaScript acepta callado corriéndolas al mes siguiente.
    if (
      Number.isNaN(fecha.getTime()) ||
      fecha.getDate() !== d ||
      fecha.getMonth() + 1 !== m
    ) {
      setError('Esa fecha no existe.');
      return;
    }

    const edad = edadDe(iso);
    if (edad === null || edad < 0 || edad > 120) {
      setError('Revisa el año.');
      return;
    }
    if (edad < EDAD_MINIMA) {
      setPaso('bloqueado');
      return;
    }

    setError(null);
    // El cumpleaños es el último paso: al guardarlo, el onboarding termina.
    void actualizarPerfil({ fechaNacimiento: iso, onboardingCompleto: true });
  }

  function alternar(key: InteresKey) {
    setElegidos((prev) => {
      const activo = prev.includes(key);
      const siguiente = activo ? prev.filter((k) => k !== key) : [...prev, key];
      // El principal es el primero que se marcó; si se desmarca, pasa el turno.
      if (activo && principal === key) setPrincipal(siguiente[0] ?? null);
      if (!activo && principal === null) setPrincipal(key);
      return siguiente;
    });
  }

  async function continuarIntereses() {
    if (guardando) return;
    setGuardando(true);
    await actualizarPerfil({ intereses: elegidos, interesPrincipal: principal });
    setGuardando(false);
    setPaso('nacimiento');
  }

  if (paso === 'bloqueado') {
    return (
      <Screen>
        <View style={styles.centro}>
          <View style={styles.circulo}>
            <Emblem name="espadas" size={40} />
          </View>
          <Text style={styles.titulo}>Vuelve más adelante</Text>
          <Text style={styles.sub}>
            Prisma Azul es para mayores de {EDAD_MINIMA} años. Aquí te esperamos.
          </Text>
          <EnlaceTenue onPress={() => setPaso('nacimiento')}>
            Me equivoqué al escribir la fecha
          </EnlaceTenue>
        </View>
      </Screen>
    );
  }

  if (paso === 'identidad') {
    return (
      <Screen>
        <View style={styles.centro}>
          <View style={styles.circulo}>
            <Emblem name="corona" size={40} glow="rgba(236,200,116,.5)" />
          </View>
          <Text style={styles.kicker}>Paso 1 de 3</Text>
          <Text style={styles.titulo}>Bienvenida a Prisma Azul</Text>
          {/* Los dos campos ya dicen qué se pide; lo que no es evidente, y
              tranquiliza, es que no hay contraseña ni espera. */}
          <Text style={styles.sub}>Sin contraseñas ni confirmaciones.</Text>

          <TextInput
            value={nombreCampo}
            onChangeText={(t) => {
              setNombreCampo(t);
              if (error) setError(null);
            }}
            placeholder="Tu nombre"
            placeholderTextColor={lavenderDim(0.4)}
            autoCapitalize="words"
            autoComplete="name"
            // Los mismos topes que las restricciones CHECK de `perfiles`: un
            // campo que acepta más de lo que la base admite falla al guardar
            // después de que la pantalla haya dicho que sí.
            maxLength={80}
            accessibilityLabel="Tu nombre"
            style={styles.campoTexto}
          />
          <TextInput
            value={correoCampo}
            onChangeText={(t) => {
              setCorreoCampo(t);
              if (error) setError(null);
            }}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor={lavenderDim(0.4)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            returnKeyType="go"
            onSubmitEditing={continuarIdentidad}
            accessibilityLabel="Tu correo"
            style={styles.campoTexto}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <BotonPrimario
            style={{ marginTop: 22, width: '100%' }}
            disabled={!nombreCampo.trim() || !correoCampo.trim()}
            onPress={continuarIdentidad}
          >
            Continuar
          </BotonPrimario>
        </View>
      </Screen>
    );
  }

  if (paso === 'nacimiento') {
    return (
      <Screen>
        <View style={styles.centro}>
          <Text style={styles.kicker}>Paso 3 de 3</Text>
          <Text style={styles.titulo}>
            {nombre ? `Hola, ${nombre}` : 'Un par de cosas'}
          </Text>
          <Text style={styles.sub}>¿Cuándo naciste?</Text>

          <View style={styles.fechaFila}>
            <Campo valor={dia} alCambiar={setDia} etiqueta="Día" max={2} ancho={72} />
            <Campo valor={mes} alCambiar={setMes} etiqueta="Mes" max={2} ancho={72} />
            <Campo valor={anio} alCambiar={setAnio} etiqueta="Año" max={4} ancho={104} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <BotonPrimario
            style={{ marginTop: 24, width: '100%' }}
            disabled={!dia || !mes || anio.length !== 4}
            onPress={continuarNacimiento}
          >
            Entrar a Prisma Azul
          </BotonPrimario>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, width: '100%', paddingTop: 20 }}>
        <Text style={styles.kicker}>Paso 2 de 3</Text>
        <Text style={styles.titulo}>¿Qué deseas manifestar?</Text>
        <Text style={styles.sub}>Puedes marcar varias.</Text>

        <View style={styles.lista}>
          {INTERESES.map((i) => {
            const activo = elegidos.includes(i.key);
            const esPrincipal = principal === i.key;
            return (
              <Pressable
                key={i.key}
                onPress={() => alternar(i.key)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: activo }}
                style={[styles.fila, activo && styles.filaActiva]}
              >
                <View style={[styles.marca, activo && styles.marcaActiva]}>
                  {activo ? <Text style={styles.marcaTexto}>✦</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.filaNombre}>{i.nombre}</Text>
                  <Text style={styles.filaSub}>{i.sub}</Text>
                </View>
                {esPrincipal ? (
                  <View style={styles.etiquetaPrincipal}>
                    <Text style={styles.etiquetaPrincipalTexto}>Principal</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={{ flex: 1, minHeight: 16 }} />

        <BotonPrimario
          style={{ marginTop: 18 }}
          disabled={guardando || elegidos.length === 0}
          onPress={() => void continuarIntereses()}
        >
          {guardando ? 'Un momento…' : 'Continuar'}
        </BotonPrimario>
        <EnlaceTenue onPress={() => setPaso('nacimiento')}>Prefiero no decirlo</EnlaceTenue>
      </View>
    </Screen>
  );
}

function Campo({
  valor,
  alCambiar,
  etiqueta,
  max,
  ancho,
}: {
  valor: string;
  alCambiar: (v: string) => void;
  etiqueta: string;
  max: number;
  ancho: number;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <TextInput
        value={valor}
        onChangeText={(t) => alCambiar(t.replace(/\D/g, '').slice(0, max))}
        placeholder={'0'.repeat(max)}
        placeholderTextColor={lavenderDim(0.3)}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={max}
        accessibilityLabel={etiqueta}
        style={[styles.campoFecha, { width: ancho }]}
      />
      <Text style={styles.campoEtiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  circulo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: goldDim(0.45),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  kicker: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.65),
    textAlign: 'center',
  },
  titulo: {
    fontFamily: font.serif,
    ...text.display,
    color: color.gold,
    textAlign: 'center',
    marginTop: 6,
  },
  sub: {
    fontFamily: font.sans,
    ...text.cuerpo,
    color: lavenderDim(0.78),
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
    alignSelf: 'center',
  },

  campoTexto: {
    width: '100%',
    marginTop: 12,
    height: 54,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: 'rgba(21,13,52,.5)',
    paddingHorizontal: 18,
    fontFamily: font.sans,
    ...text.guia,
    color: color.cream,
  },

  fechaFila: { flexDirection: 'row', gap: 12, marginTop: 30 },
  campoFecha: {
    height: 64,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: cardBorder,
    backgroundColor: 'rgba(21,13,52,.5)',
    textAlign: 'center',
    fontFamily: font.serifBold,
    fontSize: fs(26),
    color: color.cream,
  },
  campoEtiqueta: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.58),
    marginTop: 7,
  },
  error: {
    fontFamily: font.sans,
    ...text.menor,
    color: '#e79ab4',
    textAlign: 'center',
    marginTop: 14,
  },

  lista: { gap: 10, marginTop: 24 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: radius.cardSmall,
    borderWidth: 1,
    borderColor: lavenderDim(0.18),
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  filaActiva: {
    borderColor: 'rgba(236,200,116,.85)',
    backgroundColor: 'rgba(236,200,116,.08)',
  },
  marca: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: lavenderDim(0.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcaActiva: { borderColor: color.goldMid, backgroundColor: 'rgba(236,200,116,.16)' },
  marcaTexto: { fontSize: fs(12), color: color.goldMid, lineHeight: fs(15) },
  filaNombre: {
    fontFamily: font.serif,
    ...text.titulo,
    color: color.cream,
  },
  filaSub: {
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.68),
    marginTop: 2,
  },
  etiquetaPrincipal: {
    borderWidth: 1,
    borderColor: goldDim(0.5),
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  etiquetaPrincipalTexto: {
    fontFamily: font.sansBold,
    ...text.micro,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: creamDim(0.85),
  },
});
