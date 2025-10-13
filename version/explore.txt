// (Seus imports continuam os mesmos, mas adicionamos um novo)
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
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

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

  // 2. Usando o hook useQuery para buscar e gerenciar os dados.
  // Ele substitui o useState para `robos` e `loading`, e o useEffect inicial.
  const {
    data: robos, // `data` contém os robôs buscados, renomeamos para `robos`
    isLoading,   // `isLoading` substitui seu estado `loading`
    isError,     // Um booleano para indicar se houve um erro
    refetch,     // Uma função para buscar os dados manualmente de novo
  } = useQuery<Robo[], Error>({
    queryKey: ['robos'], // Chave única para esta query
    queryFn: fetchRobos,   // Função que busca os dados
  });

  // 3. Este useEffect sincroniza a lista filtrada quando os dados da query mudam.
  useEffect(() => {
    if (robos) {
      setFilteredRobos(robos);
      // Se houver uma busca ativa, reaplica o filtro após o refetch
      if (searchQuery.trim() !== '') {
        filterRobos(searchQuery, robos);
      }
    }
  }, [robos]); // Depende dos dados (`robos`) que vêm do useQuery

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
    // Implementar lógica de edição aqui
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1E1E1E' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#00D8A2"
          name="tray.full.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Robôs Cadastrados
        </ThemedText>
      </ThemedView>

      <ThemedText>
        Esta tela busca e lista todos os robôs cadastrados via{' '}
        <ThemedText type="defaultSemiBold">GET</ThemedText>.
      </ThemedText>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
          placeholder="Pesquisar robôs..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
          value={searchQuery}
          onChangeText={(text) => filterRobos(text)} // Chamada simplificada
          accessibilityLabel="Pesquisar robôs por nome ou e-mail"
        />
      </ThemedView>

      {/* 4. O botão agora chama `refetch` para buscar os dados novamente */}
      <TouchableOpacity
        style={styles.fetchButton}
        onPress={() => refetch()}
        accessibilityLabel="Buscar robôs manualmente"
      >
        <ThemedText type="defaultSemiBold" style={styles.fetchButtonText}>
          Buscar Robôs
        </ThemedText>
      </TouchableOpacity>

      <Collapsible title="Lista de robôs">
        {/* 5. Usamos `isLoading` e `isError` do useQuery */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#00D8A2" />
        ) : isError ? (
          <ThemedText style={{ textAlign: 'center', color: 'red' }}>
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
                <IconSymbol name="person.fill" size={24} color="#00D8A2" />
                <View style={styles.roboInfo}>
                  <ThemedText type="defaultSemiBold">
                    {item.nome} {item.tecnologia}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'active' ? '#00D8A2' : '#FF6347' },
                  ]}
                />
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

// Seus estilos (styles) continuam exatamente os mesmos
const styles = StyleSheet.create({
  // ... (sem alterações aqui)
});