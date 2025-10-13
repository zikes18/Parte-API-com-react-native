// app/index.tsx
import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withSequence, 
  withTiming, withSpring, runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  lightSubText: 'rgba(245, 245, 247, 0.8)',
};

export default function WelcomeScreen() {
  const router = useRouter();

  // Shared values para o container do deslize
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1); // Opacidade do container de deslize

  // Shared values para o título
  const titleTranslateY = useSharedValue(0);
  const titleOpacity = useSharedValue(1);

  // Shared values para o subtítulo
  const subtitleTranslateY = useSharedValue(0);
  const subtitleOpacity = useSharedValue(1);

  // Shared value para o ícone animado de "pulo"
  const iconTranslateY = useSharedValue(0);

  useEffect(() => {
    // Animação de "pulo" para o ícone
    iconTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        // Animação para o container de deslize
        translateY.value = event.translationY;
        opacity.value = 1 + event.translationY / 200; // Diminui opacidade ao deslizar

        // Animação para o TÍTULO
        // Move o título mais rápido para cima e o faz desaparecer
        titleTranslateY.value = event.translationY * 0.8; // Move 80% do deslize
        titleOpacity.value = 1 + event.translationY / 150; // Desaparece mais rápido

        // Animação para o SUBTÍTULO
        // Move o subtítulo um pouco mais devagar e o faz desaparecer
        subtitleTranslateY.value = event.translationY * 0.6; // Move 60% do deslize
        subtitleOpacity.value = 1 + event.translationY / 100; // Desaparece um pouco mais rápido
      }
    })
    .onEnd((event) => {
      if (event.translationY < -80) {
        // Animações finais para o container de deslize
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(-150, { duration: 200 });

        // Animações finais para o TÍTULO (garante que ele desapareça totalmente)
        titleOpacity.value = withTiming(0, { duration: 200 });
        titleTranslateY.value = withTiming(-100, { duration: 200 });

        // Animações finais para o SUBTÍTULO (garante que ele desapareça totalmente)
        subtitleOpacity.value = withTiming(0, { duration: 200 });
        subtitleTranslateY.value = withTiming(-80, { duration: 200 });

        runOnJS(router.push)('/(tabs)/home');
      } else {
        // Reseta as animações para o estado inicial com mola
        translateY.value = withSpring(0);
        opacity.value = withSpring(1);
        titleTranslateY.value = withSpring(0);
        titleOpacity.value = withSpring(1);
        subtitleTranslateY.value = withSpring(0);
        subtitleOpacity.value = withSpring(1);
      }
    });

  // Estilos animados para o container de deslize
  const animatedSwipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Estilo animado para o ícone
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconTranslateY.value }],
  }));

  // Estilo animado para o título
  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  // Estilo animado para o subtítulo
  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleTranslateY.value }],
    opacity: subtitleOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[brandColors.primaryPurple, brandColors.darkGray]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Título animado */}
        <Animated.View style={animatedTitleStyle}>
          <ThemedText style={styles.title}>JRobot Control</ThemedText>
        </Animated.View>

        {/* Subtítulo animado */}
        <Animated.View style={animatedSubtitleStyle}>
          <ThemedText style={styles.subtitle}>
            Monitoramento e Gestão ao seu Alcance
          </ThemedText>
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeContainer, animatedSwipeStyle]}>
          <Animated.View style={animatedIconStyle}>
            <Ionicons
              name="chevron-up"
              size={28}
              color={brandColors.lightSubText}
            />
          </Animated.View>
          <ThemedText style={styles.swipeText}>Deslize para começar</ThemedText>
        </Animated.View>
      </GestureDetector>
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
    width: '100%', 
    paddingHorizontal: 8, 
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
    marginBottom: 40,
  },
  swipeContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeText: {
    color: brandColors.lightSubText,
    fontSize: 16,
    marginTop: 8,
  },
});