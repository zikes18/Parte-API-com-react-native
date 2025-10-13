import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme'; // Ajuste o caminho se necessário
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Paleta de cores do seu app para consistência ---
const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  darkText: '#1c1c1e',
  placeholder: '#a9a9a9',
  cardBackground: '#2C2C2E', // Cor de fundo para os cards
  statusActive: '#28a745',   // Verde para status ativo
  statusInactive: '#dc3545', // Vermelho para status inativo
};

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
  status?: 'active' | 'inactive';
};

const fetchRobos = async (): Promise<Robo[]> => {
  const response = await fetch('https://web-production-d2cba.up.railway.app/hello');
  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da API');
  }
  const text = await response.text();
  const json = JSON.parse(text);

  return (json.data || []).map((robo: Robo) => ({
    ...robo,
    status: Math.random() > 0.5 ? 'active' : 'inactive',
  }));
};

export default function ListarScreen() {
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme); // Estilos dinâmicos

  const {
    data: robos,
    isLoading,
    isError,
    refetch,
  } = useQuery<Robo[], Error>({
    queryKey: ['robos'],
    queryFn: fetchRobos,
  });

  useEffect(() => {
    if (robos) {
      const baseData = robos || [];
      if (searchQuery.trim() === '') {
        setFilteredRobos(baseData);
      } else {
        const lowerQuery = searchQuery.toLowerCase();
        setFilteredRobos(
          baseData.filter(
            (robo) =>
              robo.nome.toLowerCase().includes(lowerQuery) ||
              robo.tecnologia.toLowerCase().includes(lowerQuery)
          )
        );
      }
    }
  }, [robos, searchQuery]);

  const handleEdit = (id: string) => {
    console.log(`Editar robô com ID: ${id}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: brandColors.darkGray, dark: brandColors.darkGray }}
      headerImage={
        <IconSymbol
          size={280}
          color={brandColors.primaryPurple} // Cor do ícone principal
          name="tray.full.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Robôs Cadastrados
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar robôs..."
          placeholderTextColor={brandColors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Pesquisar robôs por nome ou tecnologia"
        />
      </ThemedView>

      <TouchableOpacity
        style={styles.fetchButton}
        onPress={() => refetch()}
        accessibilityLabel="Buscar robôs novamente"
      >
        <ThemedText style={styles.fetchButtonText}>
          Atualizar Lista
        </ThemedText>
      </TouchableOpacity>

      <Collapsible title="Lista de robôs">
        {isLoading ? (
          <ActivityIndicator size="large" color={brandColors.primaryPurple} />
        ) : isError ? (
          <ThemedText style={styles.errorText}>
            Ocorreu um erro ao buscar os robôs.
          </ThemedText>
        ) : (
          <FlatList
            data={filteredRobos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.roboCard}
                activeOpacity={0.8}
                onPress={() => handleEdit(item.id)}
              >
                <IconSymbol name="robot.fill" size={24} color={brandColors.primaryPurple} />
                <View style={styles.roboInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.roboName}>
                    {item.nome}
                  </ThemedText>
                  <ThemedText style={styles.roboTech}>{item.tecnologia}</ThemedText>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'active' ? brandColors.statusActive : brandColors.statusInactive },
                  ]}
                />
                <TouchableOpacity onPress={() => handleEdit(item.id)} accessibilityLabel="Editar robô">
                  <IconSymbol name="pencil" size={20} color={brandColors.lightText} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </Collapsible>
    </ParallaxScrollView>
  );
}

// --- CSS (StyleSheet) Dinâmico para o Tema ---
const getStyles = (colorScheme: 'light' | 'dark' | null | undefined) =>
  StyleSheet.create({
    headerImage: {
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
      display: 'flex',  
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    searchContainer: {
      marginVertical: 20,
    },
    searchInput: {
      height: 50,
      backgroundColor: '#2C2C2E', // Fundo cinza escuro
      borderRadius: 10,
      paddingHorizontal: 15,
      color: brandColors.lightText, // Texto branco
      fontSize: 16,
      borderWidth: 1,
      borderColor: brandColors.darkGray,
      display: 'flex',  
      alignSelf: 'center',
      justifyContent: 'center',
      width: '50%',
    },
    fetchButton: {
      backgroundColor: brandColors.primaryPurple, // Fundo roxo
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
      width: '50%',
      display: 'flex',  
      alignSelf: 'center',
      justifyContent: 'center',
    },
    fetchButtonText: {
      color: '#FFFFFF', // Texto branco
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorText: {
      textAlign: 'center',
      color: brandColors.statusInactive, // Vermelho para erro
      marginTop: 10,
    },
    roboCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: brandColors.cardBackground, // Fundo do card
      padding: 15,
      borderRadius: 12,
    },
    roboInfo: {
      flex: 1,
      marginLeft: 15,
    },
    roboName: {
      fontSize: 16,
      color: brandColors.lightText,
    },
    roboTech: {
      fontSize: 14,
      color: brandColors.placeholder,
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginHorizontal: 15,
    },
  });