import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// --- Paleta de cores do seu app para consistência ---
const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  darkText: '#1c1c1e',
  placeholder: '#a9a9a9',
  inputBackgroundLight: 'rgba(242, 242, 247, 0.9)',
  inputBackgroundDark: 'rgba(58, 58, 60, 0.7)',
};

export default function EnviarScreen() {
  const colorScheme = useColorScheme();
  const [nomeRobo, setNomeRobo] = useState('');
  const [tecnologias, setTecnologias] = useState('');

  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const handleCadastrarRobo = () => {
    // Lógica para cadastrar robô
    console.log('Nome do Robô:', nomeRobo);
    console.log('Tecnologias:', tecnologias);
    // Aqui você integraria com sua API para enviar os dados
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>
          Cadastrar Robô
        </ThemedText>
        <ThemedText style={styles.description}>
          Preencha os dados abaixo para cadastrar um novo robô no sistema.
        </ThemedText>
      </ThemedView>

      <View style={styles.formContainer}>
        <ThemedText type="defaultSemiBold" style={styles.label}>Nome do Robô</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          placeholderTextColor={brandColors.placeholder}
          value={nomeRobo}
          onChangeText={setNomeRobo}
          keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        />

        <ThemedText type="defaultSemiBold" style={styles.label}>Tecnologias incluídas</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva as tecnologias embarcadas"
          placeholderTextColor={brandColors.placeholder}
          value={tecnologias}
          onChangeText={setTecnologias}
          multiline
          numberOfLines={4}
          keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastrarRobo}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Cadastrar Robô</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

// --- CSS (StyleSheet) Dinâmico para o Tema ---
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? brandColors.darkGray : '#FFFFFF', // Fundo dinâmico
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontFamily: Fonts.rounded,
      fontSize: 30,
      color: isDarkMode ? brandColors.lightText : brandColors.darkText,
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: isDarkMode ? brandColors.placeholder : brandColors.darkGray,
    },
    formContainer: {
      width: '100%',
      maxWidth: 500, // Limita a largura do formulário em telas maiores
      alignSelf: 'center', // Centraliza o formulário
    },
    label: {
      fontSize: 16,
      color: isDarkMode ? brandColors.lightText : brandColors.darkText,
      marginBottom: 8,
      marginTop: 15,
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: isDarkMode ? brandColors.inputBackgroundDark : brandColors.inputBackgroundLight,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,
      color: isDarkMode ? brandColors.lightText : brandColors.darkText,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(80, 80, 80, 0.8)' : 'rgba(200, 200, 200, 0.5)',
      // Removendo sombra específica do iOS para um look mais flat/minimalista
    },
    textArea: {
      height: 120, // Altura maior para o campo de descrição
      textAlignVertical: 'top', // Alinha o texto no topo em Android
      paddingTop: 15, // Mantém o padding consistente
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: brandColors.primaryPurple,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 20,
      ...Platform.select({ // Sombra consistente para o botão
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        android: {
          elevation: 5,
        }
      }),
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });