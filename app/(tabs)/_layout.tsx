// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Fonts } from '@/constants/fonts';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFF',
            borderTopColor: colorScheme === 'dark' ? '#444' : '#D0D0D0',
          },
        ],
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Fonts.rounded,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="crafting"
        options={{
          title: 'Crafting',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="hammer.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="enviar"
        options={{
          title: 'Enviar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="arrow.up.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listar"
        options={{
          title: 'Listar',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="tray.full.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 60,
    paddingBottom: 5,
  },
});