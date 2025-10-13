// app/(tabs)/teste.tsx

import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useQuery } from '@tanstack/react-query';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Função de busca que retorna o TEXTO BRUTO, sem JSON.parse
const fetchApiMessage = async (): Promise<string> => {
  const response = await fetch('https://web-production-d2cba.up.railway.app/hello');
  if (!response.ok) {
    throw new Error('Falha ao buscar os dados da API');
  }
  return response.text(); // Apenas retorna o texto puro
};

export default function TesteScreen() {
  const { data, isLoading, isError, error } = useQuery<string, Error>({
    queryKey: ['apiMessage'], // Uma chave diferente para não conflitar
    queryFn: fetchApiMessage,
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#007AFF"
          name="ladybug.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tela de Teste da API</ThemedText>
      </ThemedView>
      <ThemedText>
        Esta tela busca a resposta da API e a exibe como texto puro, sem tentar
        processá-la como JSON.
      </ThemedText>

      <ThemedView style={styles.responseContainer}>
        <ThemedText type="subtitle">Resposta da API:</ThemedText>
        {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
        {isError && (
          <ThemedText style={styles.errorText}>
            Erro: {error.message}
          </ThemedText>
        )}
        {data && <ThemedText style={styles.responseText}>{data}</ThemedText>}
      </ThemedView>
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
    marginBottom: 10,
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  responseText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#90EE90', // Verde claro para destacar
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#FF6347', // Tomate para erro
  },
});