import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
  first_name: string;
  last_name: string;
  email: string;
  status?: 'active' | 'inactive'; // Adicionado para demonstrar indicador de status
};

export default function ListarScreen() {
  const [robos, setRobos] = useState<Robo[]>([]);
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function buscarRobos() {
      try {
        const response = await fetch('https://web-production-d2cba.up.railway.app/hello');
        const json = await response.json();
        const robosData = (json.data || []).map((robo: Robo) => ({
          ...robo,
          status: Math.random() > 0.5 ? 'active' : 'inactive', // Simulação de status
        }));
        setRobos(robosData);
        setFilteredRobos(robosData);
      } catch (error) {
        console.error('Erro ao buscar robôs:', error);
      } finally {
        setLoading(false);
      }
    }

    buscarRobos();
  }, []);

  const filterRobos = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRobos(robos);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredRobos(
        robos.filter(
          (robo) =>
            robo.first_name.toLowerCase().includes(lowerQuery) ||
            robo.last_name.toLowerCase().includes(lowerQuery) ||
            robo.email.toLowerCase().includes(lowerQuery)
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
        Esta tela busca e lista todos os robôs cadastrados via <ThemedText type="defaultSemiBold">GET</ThemedText>.
      </ThemedText>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
          placeholder="Pesquisar robôs..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
          value={searchQuery}
          onChangeText={filterRobos}
          accessibilityLabel="Pesquisar robôs por nome ou e-mail"
        />
      </ThemedView>

      <Collapsible title="Lista de robôs">
        {loading ? (
          <ActivityIndicator size="large" color="#00D8A2" />
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
                    {item.first_name} {item.last_name}
                  </ThemedText>
                  <ThemedText>{item.email}</ThemedText>
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

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  searchContainer: {
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#2A2A2A',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  roboCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
  },
  roboInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});