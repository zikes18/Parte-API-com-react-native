// screens/index.tsx (HomeScreen)
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Colors } from '@/constants/theme';
import { ThemeContext } from '@/app/context/theme-context';

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useContext(ThemeContext);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.background, dark: Colors.dark.background }}
      headerImage={
        <IconSymbol
          size={200}
          color={Colors[colorScheme].tint}
          name="house.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Bem-vindo ao App
        </ThemedText>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: Colors[colorScheme].cardBackground }]}
          onPress={toggleColorScheme}
          accessibilityLabel={`Alternar para modo ${colorScheme === 'dark' ? 'claro' : 'escuro'}`}
        >
          <IconSymbol
            size={24}
            name={colorScheme === 'dark' ? 'sun.max.fill' : 'moon.fill'}
            color={Colors[colorScheme].tint}
          />
        </TouchableOpacity>
      </ThemedView>

      <ThemedText style={[styles.description, { color: Colors[colorScheme].text }]}>
        Explore as funcionalidades do aplicativo, como criar, listar e enviar robôs.
      </ThemedText>

      <ThemedView style={[styles.contentContainer, { backgroundColor: Colors[colorScheme].cardBackground, borderColor: Colors[colorScheme].border }]}>
        <ThemedText type="subtitle">O que você pode fazer:</ThemedText>
        <ThemedText>- Criar novos robôs na aba Crafting</ThemedText>
        <ThemedText>- Explorar robôs na aba Explore</ThemedText>
        <ThemedText>- Enviar dados na aba Enviar</ThemedText>
        <ThemedText>- Visualizar robôs cadastrados na aba Listar</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -60,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  themeButton: {
    padding: 10,
    borderRadius: 8,
  },
  description: {
    marginBottom: 15,
  },
  contentContainer: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
});