// Importações necessárias do React Native e Expo
import { ThemeContext } from '@/components/theme-context'; // Supondo que você tenha este contexto
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
};

// A lógica de fetch continua a mesma
const fetchRobos = async (): Promise<Robo[]> => {
  const response = await fetch('https://api-robo-production.up.railway.app/robos');
  if (!response.ok) {
    throw new Error(`Falha ao buscar os dados da API (Status: ${response.status})`);
  }
  const responseText = await response.text();
  try {
    const data = JSON.parse(responseText);
    if (data && Array.isArray(data.content)) {
      return data.content;
    }
    if (Array.isArray(data)) {
      return data;
    }
    throw new Error("A resposta JSON não continha o formato esperado.");
  } catch (e) {
    console.error("A resposta da API não é um JSON válido:", responseText);
    throw new Error(`Formato de resposta inesperado da API.`);
  }
};


export default function ListarScreen() {
  // Assumindo que você tem um contexto de tema para dark/light mode
  const { colorScheme } = useContext(ThemeContext);
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode); // Gera os estilos com base no tema

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);

  const { data: robos, isLoading, isError, error } = useQuery<Robo[], Error>({
    queryKey: ['robos'],
    queryFn: fetchRobos,
  });

  useEffect(() => {
    if (robos) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = searchQuery.trim() === ''
        ? robos
        : robos.filter(
            (robo) =>
              robo.nome.toLowerCase().includes(lowerCaseQuery) ||
              robo.tecnologia.toLowerCase().includes(lowerCaseQuery)
          );
      setFilteredRobos(filtered);
    }
  }, [searchQuery, robos]);

  // Função para renderizar cada item da lista no FlatList
  const renderRoboItem = ({ item }: { item: Robo }) => (
    <View style={styles.roboCard}>
      <View style={styles.roboInfo}>
        <Text style={styles.roboName}>{item.nome}</Text>
        <Text style={styles.roboTech}>{item.tecnologia}</Text>
      </View>
      <Link href={{ pathname: "/editar-robo", params: { id: item.id } }} asChild>
        <Pressable style={styles.editButton}>
          <FontAwesome name="pencil" size={16} color={brandColors.lightText} />
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Robôs Cadastrados</Text>
          <Link href="/enviar" asChild>
            <Pressable style={styles.buttonLink}>
              <Text style={styles.buttonLinkText}>Cadastrar Novo</Text>
            </Pressable>
          </Link>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome ou tecnologia..."
          placeholderTextColor={brandColors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        />

        {isLoading && (
          <ActivityIndicator size="large" color={brandColors.primaryPurple} style={{ marginTop: 20 }} />
        )}
        
        {isError && (
          <Text style={[styles.statusText, styles.errorText]}>Erro ao carregar: {error?.message}</Text>
        )}
        
        {!isLoading && !isError && (
          // Usamos FlatList para listas em React Native. É otimizado e eficiente.
          <FlatList
            data={filteredRobos}
            renderItem={renderRoboItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.statusText}>Nenhum robô encontrado.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  darkText: '#1c1c1e',
  placeholder: '#a9a9a9',
  cardBackgroundLight: '#FFFFFF',
  cardBackgroundDark: '#1c1c1e',
  backgroundLight: '#f2f2f7',
  backgroundDark: '#000000',
  borderLight: 'rgba(200, 200, 200, 0.6)',
  borderDark: 'rgba(50, 50, 50, 0.8)',
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? brandColors.backgroundDark : brandColors.backgroundLight,
  },
  container: {
    flex: 1,
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap', // Permite que os itens quebrem a linha em telas pequenas
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
  },
  buttonLink: {
    backgroundColor: brandColors.primaryPurple,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonLinkText: {
    color: brandColors.lightText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchInput: {
    height: 50,
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 24,
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    fontSize: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? brandColors.borderDark : brandColors.borderLight,
  },
  listContainer: {
    paddingBottom: 20, // Espaçamento no final da lista
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
    color: brandColors.placeholder,
    marginTop: 20,
  },
  errorText: {
    color: '#FF6347',
  },
  roboCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    // Sombra para iOS e Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.4 : 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roboInfo: {
    flex: 1,
  },
  roboName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.primaryPurple : brandColors.darkText,
  },
  roboTech: {
    fontSize: 14,
    color: isDarkMode ? brandColors.lightText : brandColors.darkGray,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: brandColors.darkGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: brandColors.lightText,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});