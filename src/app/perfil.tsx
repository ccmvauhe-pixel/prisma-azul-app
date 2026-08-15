/**
 * Perfil — ajustes de la persona.
 *
 * Reúne lo que estaba repartido: los avisos de cada lectura (que hasta ahora
 * solo se tocaban desde la pantalla bloqueada de cada sección), los datos del
 * onboarding y la cuenta.
 *
 * El interruptor de tema está preparado pero no cambia nada todavía: el diseño
 * de Gilda es solo oscuro y una paleta clara habría que diseñarla, no deducirla.
 */
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Emblem } from '@/components/Emblem';
import { Header, Screen } from '@/components/Screen';
import { Toast } from '@/components/ui';
import { abrioSeccion, vaciarAhora } from '@/lib/analitica';
import { correoValido } from '@/lib/auth';
import {
  INTERESES,
  actualizarPerfil,
  edadDe,
  usePerfil,
  type InteresKey,
} from '@/lib/perfil';
import { setState, useStore } from '@/lib/store';
import { subirAhora } from '@/lib/sync';
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

const LECTURAS = [
  { key: 'cruz', nombre: 'Cruz de Vida', ritmo: 'Cada semana', emblema: 'copas' },
  { key: 'oraculo', nombre: 'Oráculo del día', ritmo: 'Cada 24 horas', emblema: 'bastos' },
  { key: 'codigo', nombre: 'Código sagrado', ritmo: 'Cada semana', emblema: 'oros' },
  { key: 'afirmacion', nombre: 'Afirmación', ritmo: 'Cada semana', emblema: 'copas' },
] as const;

export default function Perfil() {
  const router = useRouter();
  const s = useStore();
  const perfil = usePerfil();

  const [nombre, setNombre] = useState(perfil?.nombre ?? '');
  const [correo, setCorreo] = useState(perfil?.correo ?? '');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => abrioSeccion('perfil'), []);

  function avisar(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2400);
  }

  const edad = edadDe(perfil?.fechaNacimiento ?? null);

  function alternarInteres(key: InteresKey) {
    if (!perfil) return;
    const activo = perfil.intereses.includes(key);
    const siguiente = activo
      ? perfil.intereses.filter((k) => k !== key)
      : [...perfil.intereses, key];
    void actualizarPerfil({
      intereses: siguiente,
      interesPrincipal:
        activo && perfil.interesPrincipal === key
          ? (siguiente[0] ?? null)
          : (perfil.interesPrincipal ?? key),
    });
  }

  /**
   * Salir por el "‹" sube lo pendiente antes de irse.
   *
   * Antes esto vivía en un botón "Volver a Mi Camino" al final de la pantalla,
   * que hacía exactamente lo mismo que la flecha de arriba. Dos controles para
   * una sola acción: se queda el que ya esperabas encontrar.
   */
  function salir() {
    void (async () => {
      await subirAhora();
      await vaciarAhora();
      router.back();
    })();
  }

  return (
    <Screen>
      <Header kicker="Tu cuenta" titulo="Mi perfil" onBack={salir} />

      {/* — Identidad — */}
      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>Tus datos</Text>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          onBlur={() => {
            const limpio = nombre.trim();
            if (limpio.length > 1 && limpio !== perfil?.nombre) {
              void actualizarPerfil({ nombre: limpio });
              avisar('✨ Nombre actualizado');
            }
          }}
          placeholder="Tu nombre"
          placeholderTextColor={lavenderDim(0.4)}
          autoCapitalize="words"
          // Los mismos topes que las restricciones CHECK de `perfiles`. Si el
          // campo acepta más de lo que la base admite, el guardado falla y la
          // pantalla ya ha dicho que sí.
          maxLength={80}
          style={styles.campo}
          accessibilityLabel="Tu nombre"
        />

        <Text style={styles.etiqueta}>Correo</Text>
        <TextInput
          value={correo}
          onChangeText={setCorreo}
          onBlur={() => {
            const limpio = correo.trim().toLowerCase();
            if (limpio && limpio !== perfil?.correo && correoValido(limpio)) {
              void actualizarPerfil({ correo: limpio });
              avisar('✨ Correo actualizado');
            }
          }}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor={lavenderDim(0.4)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          inputMode="email"
          maxLength={254}
          style={styles.campo}
          accessibilityLabel="Tu correo"
        />
        {/*
          El correo es un dato del perfil, no una credencial: hoy no hay
          contraseña ni confirmación por correo. Se guarda al salir del campo,
          como el nombre.
        */}

        {perfil?.fechaNacimiento ? (
          <>
            <Text style={styles.etiqueta}>Nacimiento</Text>
            <Text style={styles.valorFijo}>
              {perfil.fechaNacimiento}
              {edad !== null ? ` · ${edad} años` : ''}
            </Text>
          </>
        ) : null}
      </View>

      {/* — Intereses — */}
      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>Qué deseas manifestar</Text>
        {/* Que se puede cambiar ya lo dice el hecho de poder tocarlo. */}
        <View style={{ gap: 8, marginTop: 14 }}>
          {INTERESES.map((i) => {
            const activo = perfil?.intereses.includes(i.key) ?? false;
            return (
              <Pressable
                key={i.key}
                onPress={() => alternarInteres(i.key)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: activo }}
                style={[styles.interes, activo && styles.interesActivo]}
              >
                <View style={[styles.marca, activo && styles.marcaActiva]}>
                  {activo ? <Text style={styles.marcaTexto}>✦</Text> : null}
                </View>
                <Text style={styles.interesNombre}>{i.nombre}</Text>
                {perfil?.interesPrincipal === i.key ? (
                  <Text style={styles.principal}>Principal</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* — Avisos — */}
      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>Avisos</Text>
        <Text style={styles.bloqueSub}>
          Te avisamos cuando cada lectura vuelve a estar disponible.
        </Text>
        <View style={{ marginTop: 12 }}>
          {LECTURAS.map((r) => (
            <View key={r.key} style={styles.filaAviso}>
              <Emblem name={r.emblema} size={22} />
              <View style={{ flex: 1 }}>
                <Text style={styles.avisoNombre}>{r.nombre}</Text>
                <Text style={styles.avisoRitmo}>{r.ritmo}</Text>
              </View>
              <Switch
                value={s.notif[r.key]}
                onValueChange={() =>
                  setState((st) => ({ notif: { ...st.notif, [r.key]: !st.notif[r.key] } }))
                }
                trackColor={{ false: lavenderDim(0.2), true: 'rgba(236,200,116,.45)' }}
                thumbColor={s.notif[r.key] ? color.goldMid : lavenderDim(0.6)}
                accessibilityLabel={`Avisos de ${r.nombre}`}
              />
            </View>
          ))}
        </View>
      </View>

      {/* — Tema — */}
      <View style={styles.bloque}>
        <Text style={styles.bloqueTitulo}>Apariencia</Text>
        <View style={styles.filaAviso}>
          <Emblem name="espadas" size={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.avisoNombre}>Versión de día</Text>
            <Text style={styles.avisoRitmo}>Próximamente</Text>
          </View>
          <Switch
            value={perfil?.tema === 'dia'}
            onValueChange={(v) => {
              void actualizarPerfil({ tema: v ? 'dia' : 'noche' });
              avisar('✨ Guardado. La versión de día llegará pronto');
            }}
            trackColor={{ false: lavenderDim(0.2), true: 'rgba(236,200,116,.45)' }}
            thumbColor={perfil?.tema === 'dia' ? color.goldMid : lavenderDim(0.6)}
            accessibilityLabel="Versión de día"
          />
        </View>
        {/*
          Aquí había un párrafo explicando por qué la versión de día aún no
          existe. "Próximamente", debajo del nombre, ya lo dice todo: nadie
          necesita leer tres frases sobre un interruptor que no hace nada.
        */}
      </View>

      {/*
        No hay "Cerrar sesión" a propósito.

        La sesión es anónima: sin contraseña no habría forma de volver a entrar,
        así que ese botón borraría la cuenta para siempre sin avisar. Volverá
        cuando existan las contraseñas.
      */}
      <Toast mensaje={toast} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bloque: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: cardBorder,
    borderRadius: radius.cardSmall,
    padding: 18,
    backgroundColor: 'rgba(21,13,52,.45)',
  },
  bloqueTitulo: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: goldDim(0.85),
  },
  bloqueSub: {
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.7),
    marginTop: 7,
  },
  etiqueta: {
    fontFamily: font.sansSemi,
    ...text.micro,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: lavenderDim(0.58),
    marginTop: 16,
  },
  campo: {
    marginTop: 7,
    height: 50,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: lavenderDim(0.22),
    backgroundColor: 'rgba(10,7,32,.5)',
    paddingHorizontal: 15,
    fontFamily: font.sans,
    ...text.guia,
    color: color.cream,
  },
  valorFijo: {
    fontFamily: font.sans,
    ...text.cuerpo,
    color: creamDim(0.9),
    marginTop: 7,
  },

  interes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lavenderDim(0.16),
  },
  interesActivo: {
    borderColor: 'rgba(236,200,116,.75)',
    backgroundColor: 'rgba(236,200,116,.07)',
  },
  marca: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: lavenderDim(0.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcaActiva: { borderColor: color.goldMid, backgroundColor: 'rgba(236,200,116,.16)' },
  marcaTexto: { fontSize: fs(11), color: color.goldMid, lineHeight: fs(14) },
  interesNombre: {
    flex: 1,
    fontFamily: font.sans,
    ...text.cuerpo,
    color: color.cream,
  },
  principal: {
    fontFamily: font.sansBold,
    ...text.micro,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: goldDim(0.85),
  },

  filaAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  avisoNombre: { fontFamily: font.sans, ...text.cuerpo, color: color.cream },
  avisoRitmo: {
    fontFamily: font.sans,
    ...text.menor,
    color: lavenderDim(0.6),
    marginTop: 1,
  },
});
