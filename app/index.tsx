// app/index.tsx
import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  lightSubText: 'rgba(245, 245, 247, 0.8)',
};

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[brandColors.primaryPurple, brandColors.darkGray]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          JRobot Control
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Monitoramento e Gestão ao seu Alcance
        </ThemedText>

        {/* Botão para entrar no app (navega para as abas) */}
        <Link href="/(tabs)/home" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Entrar</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: brandColors.lightText,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: brandColors.lightSubText,
    textAlign: 'center',
    marginBottom: 40, // Espaço entre o subtítulo e o botão
  },
  button: {
    backgroundColor: brandColors.primaryPurple,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    // Sombra para destacar o botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: brandColors.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});