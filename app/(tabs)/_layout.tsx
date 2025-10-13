// app/(tabs)/_layout.tsx
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/fonts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const queryClient = new QueryClient();

const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#2C2C2E',
  inactiveGray: '#9E9E9E',
};

export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: brandColors.primaryPurple,
          tabBarInactiveTintColor: brandColors.inactiveGray,
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: brandColors.darkGray,
              borderTopColor: '#444',
            },
          ],
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '800',
            fontFamily: Fonts.rounded,
            textAlign: 'center',
            color: '#FFFFFF', // Removido para usar as cores active/inactive
          },
        }}>
        <Tabs.Screen
          name="home" // Corresponde a app/(tabs)/home.tsx
          options={{
            title: 'Principal',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="notif" // Corresponde a app/(tabs)/explore.tsx
          options={{
            title: 'Notificação',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="safari.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="listar" // Corresponde a app/(tabs)/listar.tsx
          options={{
            title: 'Listar',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="tray.full.fill" color={color} />,
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
});