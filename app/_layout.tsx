// app/_layout.tsx

import { ThemeProvider } from '@/components/theme-context'; // 1. Importe seu ThemeProvider
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
  // A lógica de tema será movida para dentro do ThemeProvider,
  // mas podemos manter o ThemeProvider do React Navigation se quisermos.
  // Para simplificar, vamos focar no nosso contexto.

  return (
    // 2. Envolva tudo com o ThemeProvider
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <ThemeProvider> 
        <QueryClientProvider client={queryClient}>
          {/*
            O ideal é que o ThemeProvider do React Navigation também consuma nosso
            contexto, mas para fazer sua tela funcionar, o mais importante
            é o nosso <ThemeProvider> estar por fora de tudo.
          */}
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="editar-robo" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}