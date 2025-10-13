import { ThemeContext } from '@/components/theme-context';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/fonts';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RobotMonitorScreen() {
  // Hooks para gerenciar o tema e o estado do formulário
  const { colorScheme, toggleColorScheme } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode); // Gera os estilos com base no tema

  return (
    <LinearGradient
      colors={[brandColors.primaryPurple, brandColors.darkGray]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        
        <Pressable onPress={toggleColorScheme} style={styles.themeToggleContainer}>
          {({ pressed }) => (
            <FontAwesome
              name={isDarkMode ? 'sun-o' : 'moon-o'}
              size={25}
              color={brandColors.lightText}
              style={{ opacity: pressed ? 0.7 : 1 }}
            />
          )}
        </Pressable>

        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.mainTitle}>
            JRobot Monitor
          </ThemedText>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginCardTitle}>Acessar Painel</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor={brandColors.placeholder}
            value={username}
            onChangeText={setUsername}
            keyboardAppearance={isDarkMode ? 'dark' : 'light'}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={brandColors.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            keyboardAppearance={isDarkMode ? 'dark' : 'light'}
          />
          
          <Pressable 
            style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]} 
            onPress={() => console.log("Login: ", username, password)}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Pressable>
        </View>

      </View>
    </LinearGradient>
  );
}

const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  darkText: '#1c1c1e',
  placeholder: '#a9a9a9',
  cardBackgroundLight: 'rgba(255, 255, 255, 0.9)',
  cardBackgroundDark: 'rgba(28, 28, 30, 0.85)',
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 20,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 1, 
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  mainTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 40,
    color: brandColors.lightText,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8,
  },
  loginCard: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      }
    }),
  },
  loginCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: isDarkMode ? 'rgba(58, 58, 60, 0.7)' : 'rgba(242, 242, 247, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    fontSize: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(80, 80, 80, 0.8)' : 'rgba(200, 200, 200, 0.5)',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: brandColors.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    elevation: 5, // Sombra para Android
  },
  loginButtonPressed: {
    opacity: 0.85,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});