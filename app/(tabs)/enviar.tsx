import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Button,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function EnviarScreen() {
  const [nome, setNome] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [loading, setLoading] = useState(false);

  async function cadastrarRobo() {
    if (!nome || !tecnologias) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://web-production-d2cba.up.railway.app/Hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          tecnologias: tecnologias,
        }),
      });

      const data = await response.json();
      console.log('Resposta:', data);
      Alert.alert('Robô cadastrado', `ID: ${data.id || 'teste'}`);
      setNome('');
      setTecnologias('');
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Falha ao cadastrar o robô.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1E1E1E' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#00A2FF"
          name="gear.badge.plus"
          style={styles.headerImage}
        />
      }>
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
            title={loading ? 'Cadastrando...' : 'Cadastrar Robô'}
            onPress={cadastrarRobo}
            disabled={loading}
            color="#00A2FF"
          />
        </View>
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
  label: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    marginTop: 6,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});
