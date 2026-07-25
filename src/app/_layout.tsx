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
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { reprogramar } from '@/lib/notifications';
import { hydrate, useHydrated, useStore } from '@/lib/store';
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

  useEffect(() => {
    void hydrate();
  }, []);

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

  if (!fuentesListas || !hidratado) {
    return <View style={{ flex: 1, backgroundColor: color.base }} />;
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
