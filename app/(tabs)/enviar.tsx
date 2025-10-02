// app/(tabs)/enviar.tsx

import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View, Button, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view'; // Adicionado ThemedView para o container
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

type NovoRobo = {
  nome: string;
  tecnologias: string;
};

const cadastrarRoboAPI = async (novoRobo: NovoRobo) => {
  const response = await fetch('https://web-production-d2cba.up.railway.app/Hello', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoRobo),
  });
  if (!response.ok) {
    throw new Error('Falha ao cadastrar o robô');
  }
  return response.json();
};

export default function EnviarScreen() {
  const [nome, setNome] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: cadastrarRoboAPI,
    onSuccess: (data) => {
      Alert.alert('Sucesso!', `Robô cadastrado com ID: ${data.id || 'N/A'}`);
      queryClient.invalidateQueries({ queryKey: ['robos'] });
      router.back();
    },
    onError: (error) => {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Falha ao cadastrar o robô.');
    },
  });

  function handleCadastro() {
    if (!nome || !tecnologias) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    mutation.mutate({ nome, tecnologias });
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1E1E1E' }}
      headerImage={<Image size={280} color="#00A2FF" source={require('../../assets/images/gearbadge.png')} style={styles.headerImage} />}>
      <ThemedView style={styles.contentContainer}>
        {/* Título */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Cadastrar Robô
          </ThemedText>
        </ThemedView>

        <ThemedText>
          Preencha os dados abaixo para cadastrar um novo robô no sistema.
        </ThemedText>

        <Collapsible title="Formulário de cadastro">
          <ThemedText style={styles.label}>Nome do Robô</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#999"
          />

          <ThemedText style={styles.label}>Tecnologias inclusas</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva as tecnologias embarcadas"
            multiline
            numberOfLines={4}
            value={tecnologias}
            onChangeText={setTecnologias}
            placeholderTextColor="#999"
          />

          <View style={styles.buttonContainer}>
            <Button
              title={mutation.isPending ? 'Cadastrando...' : 'Cadastrar Robô'}
              onPress={handleCadastro}
              disabled={mutation.isPending}
              color="#00A2FF"
            />
          </View>
        </Collapsible>
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
  // NOVO: Estilo para o container principal do conteúdo
  contentContainer: {
    paddingHorizontal: 16, // Adiciona um preenchimento para não colar nas bordas
  },
  titleContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  label: { marginTop: 10, color: '#ccc', fontSize: 16, fontWeight: '500' },
  input: { marginTop: 6, backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 10, color: '#fff' },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: 20, width: '100%' },
});