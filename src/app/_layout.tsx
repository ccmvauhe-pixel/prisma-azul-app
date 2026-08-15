/**
 * Raíz de la app: carga las dos familias tipográficas del diseño, hidrata el
 * estado guardado y mantiene los avisos programados al día.
 *
 * La navegación es una pila sin barra de pestañas, como pide el handoff: todo se
 * abre desde Mi Camino y cada pantalla vuelve con "‹".
 */
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
  CormorantGaramond_700Bold,
  useFonts,
} from '@expo-google-fonts/cormorant-garamond';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import { Stack } from 'expo-router';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NuevaPassword } from '@/components/NuevaPassword';
import { Onboarding } from '@/components/Onboarding';
import {
  entrarAnonimo,
  iniciarAuth,
  procesarEnlace,
  useAuthLista,
  useEnRecuperacion,
  useSesion,
} from '@/lib/auth';
import { hidratarContenido, sincronizarContenido } from '@/lib/contenido';
import { reprogramar } from '@/lib/notifications';
import { cargarPerfil, olvidarPerfil, usePerfil, usePerfilListo } from '@/lib/perfil';
import { hydrate, useHydrated, useStore } from '@/lib/store';
import { haySupabase } from '@/lib/supabase';
import { iniciarSync } from '@/lib/sync';
import { color } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fuentesListas] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    CormorantGaramond_700Bold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  const hidratado = useHydrated();
  const estado = useStore();
  const sesion = useSesion();
  const authLista = useAuthLista();
  const perfil = usePerfil();
  const perfilListo = usePerfilListo();
  const enRecuperacion = useEnRecuperacion();

  useEffect(() => {
    void hydrate();
  }, []);

  /*
   * Contenido: primero la caché (rápida, local), y solo después se mira si el
   * servidor tiene algo más nuevo. Así la app abre con textos al día sin
   * esperar a la red, y sin red abre igual con los empaquetados.
   */
  useEffect(() => {
    void hidratarContenido().then(() => sincronizarContenido());
  }, []);

  // Sesión de Supabase: se sigue desde el arranque.
  useEffect(() => iniciarAuth(), []);

  /*
   * Acceso anónimo automático.
   *
   * No hay pantalla de login: la sesión se abre sola y sin contraseña, así que
   * nadie espera un correo de confirmación. El nombre y el correo se piden
   * después, en el onboarding, como datos del perfil.
   */
  useEffect(() => {
    if (!haySupabase || !authLista || sesion) return;
    void entrarAnonimo();
  }, [authLista, sesion]);

  /*
   * Vuelta del enlace mágico.
   *
   * Hay que mirar en dos sitios: el enlace que abrió la app estando cerrada
   * (`getInitialURL`) y el que llega con la app ya abierta (`addEventListener`).
   * Atender solo uno deja la mitad de los casos sin funcionar.
   */
  useEffect(() => {
    if (!haySupabase) return;

    void Linking.getInitialURL().then((url) => {
      if (url) void procesarEnlace(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      void procesarEnlace(url);
    });
    return () => sub.remove();
  }, []);

  // La sincronización vive mientras haya sesión y estado ya hidratado.
  useEffect(() => {
    if (!hidratado || !sesion) return;
    return iniciarSync();
  }, [hidratado, sesion]);

  // El perfil se carga al entrar la sesión y se olvida al salir: dejarlo puesto
  // enseñaría el nombre de la persona anterior a la siguiente que entre.
  useEffect(() => {
    if (sesion) void cargarPerfil();
    else olvidarPerfil();
  }, [sesion]);

  // Cada vez que cambia un temporizador o una preferencia, se recalculan los avisos.
  useEffect(() => {
    if (!hidratado) return;
    void reprogramar(estado);
  }, [
    hidratado,
    estado.afirmacionLock,
    estado.oraculoLock,
    estado.cruzNext,
    estado.codigoActivo,
    estado.notif,
    estado,
  ]);

  useEffect(() => {
    if (fuentesListas && hidratado) void SplashScreen.hideAsync();
  }, [fuentesListas, hidratado]);

  // Sin backend configurado no hay nada que esperar: `authLista` se resuelve
  // sola y la compuerta de acceso ni se plantea.
  if (!fuentesListas || !hidratado || (haySupabase && !authLista)) {
    return <View style={{ flex: 1, backgroundColor: color.base }} />;
  }

  /*
   * Contraseña nueva, antes que nada.
   *
   * Al canjear un enlace de recuperación Supabase deja la sesión iniciada. Sin
   * esta compuerta se entraba directamente a la app: el enlace daba acceso pero
   * nadie llegaba a elegir contraseña, así que el problema que trajo a la
   * persona hasta aquí seguía sin resolverse y volvía a quedarse fuera.
   *
   * Va por delante del onboarding a propósito — quien recupera su cuenta ya lo
   * completó en su día.
   */
  if (sesion && enRecuperacion) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NuevaPassword />
      </SafeAreaProvider>
    );
  }

  /*
   * Onboarding: solo la primera vez, tras crear la cuenta.
   *
   * Se espera a `perfilListo` para no enseñárselo un instante a quien ya lo
   * completó mientras el perfil viaja desde el servidor.
   */
  if (sesion && perfilListo && perfil && !perfil.onboardingCompleto) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Onboarding />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.base },
          animation: 'fade',
        }}
      />
    </SafeAreaProvider>
  );
}
