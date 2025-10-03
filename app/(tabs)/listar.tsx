// app/(tabs)/listar.tsx

import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query'; // ALTERADO: Import do useQuery
import { useRouter } from 'expo-router'; // NOVO: Import para navegação

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
  status?: 'active' | 'inactive';
};

// Função de busca extraída para o useQuery
const fetchRobos = async (): Promise<Robo[]> => {
  const response = await fetch('https://api-robo-production.up.railway.app/robos');
  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da API');
  }
  const json = await response.json();
  return (json.data || []).map((robo: Robo) => ({
    ...robo,
    status: Math.random() > 0.5 ? 'active' : 'inactive',
  }));
};

export default function ListarScreen() {
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const router = useRouter(); // NOVO: Hook para controlar a navegação

  // ALTERADO: Lógica de busca de dados com TanStack Query
  const { data: robos, isLoading, isError } = useQuery<Robo[], Error>({
    queryKey: ['robos'], // Chave única para esta query
    queryFn: fetchRobos,
  });

  // Sincroniza a lista filtrada quando os dados da query mudam
  useEffect(() => {
    if (robos) {
      if (searchQuery.trim() === '') {
        setFilteredRobos(robos);
      } else {
        filterRobos(searchQuery, robos);
      }
    }
  }, [robos]);

  const filterRobos = (query: string, baseData: Robo[] = robos || []) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRobos(baseData);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredRobos(
        baseData.filter(
          (robo) =>
            robo.nome.toLowerCase().includes(lowerQuery) ||
            robo.tecnologia.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editar robô com ID: ${id}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1E1E1E' }}
      headerImage={
        <IconSymbol size={280} color="#00D8A2" name="tray.full.fill" style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Robôs Cadastrados
        </ThemedText>
      </ThemedView>

      {/* NOVO: Botão para navegar para a tela de cadastro */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Novo Robô"
          onPress={() => router.push('/enviar')} // Navega para a rota 'enviar'
          color="#00A2FF"
        />
      </View>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
          placeholder="Pesquisar robôs..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
          value={searchQuery}
          onChangeText={(text) => filterRobos(text)}
        />
      </ThemedView>

      <Collapsible title="Lista de robôs">
        {isLoading ? (
          <ActivityIndicator size="large" color="#00D8A2" />
        ) : isError ? (
          <ThemedText style={{ color: 'red', textAlign: 'center' }}>Erro ao carregar os robôs.</ThemedText>
        ) : (
          <FlatList
            data={filteredRobos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.roboCard} activeOpacity={0.8} onPress={() => handleEdit(item.id)}>
                <IconSymbol name="person.fill" size={24} color="#00D8A2" />
                <View style={styles.roboInfo}>
                  <ThemedText type="defaultSemiBold">
                    {item.nome} {item.tecnologia}
                  </ThemedText>
                </View>
                <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#00D8A2' : '#FF6347' }]} />
                <TouchableOpacity onPress={() => handleEdit(item.id)} accessibilityLabel="Editar robô">
                  <IconSymbol name="pencil" size={20} color="#FFF" />
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

// Estilos (adicionado buttonContainer)
const styles = StyleSheet.create({
  // ... (seus estilos existentes)
  buttonContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  headerImage: { bottom: -90, left: -35, position: 'absolute' },
  titleContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  searchContainer: { padding: 10, marginBottom: 10 },
  searchInput: { backgroundColor: '#2A2A2A', padding: 10, borderRadius: 8, fontSize: 16 },
  roboCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, borderColor: '#444', borderWidth: 1 },
  roboInfo: { flex: 1, marginLeft: 10, marginRight: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
});