// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';

// O QueryClient continua no ponto mais alto do app.
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="index" // Corresponde ao arquivo app/index.tsx
            options={{ headerShown: false }} 
          />

          {/* 4. Suas rotas originais são mantidas e funcionarão normalmente. */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="modal" 
            options={{ presentation: 'modal', title: 'Modal' }} 
          />
          <Stack.Screen 
            name="editar-robo" 
            options={{ presentation: 'modal', title: 'Editar Robô' }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}