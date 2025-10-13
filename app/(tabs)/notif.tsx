// app/notificacao.tsx
import { ThemeContext } from '@/components/theme-context';
import { FontAwesome } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// --- Paleta de cores baseada no seu logo (mantida para consistência) ---
const brandColors = {
  primaryPurple: '#6e42a8',
  darkGray: '#3a3a3a',
  lightText: '#f5f5f7',
  darkText: '#1c1c1e',
  placeholder: '#a9a9a9',
  cardBackgroundLight: 'rgba(255, 255, 255, 0.9)',
  cardBackgroundDark: 'rgba(28, 28, 30, 0.85)',
  success: '#28a745', // Verde para sucesso
  danger: '#dc3545', // Vermelho para erro
};

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
  status?: string; // Adicionado status para o robô
};

// Função para buscar os detalhes de um único robô
const fetchRoboById = async (id: string): Promise<Robo> => {
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar detalhes do robô (Status: ${response.status})`);
  }
  const data = await response.json();
  return data; // Assumimos que retorna o objeto do robô diretamente
};

// Função para enviar uma atualização (PUT) para o robô
const updateRoboStatus = async ({ id, newStatus }: { id: string; newStatus: string }): Promise<Robo> => {
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}/acoes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }), // Exemplo de corpo da requisição
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao atualizar status do robô (Status: ${response.status}, Erro: ${errorText})`);
  }
  return response.json(); // Retorna o robô atualizado
};

export default function NotificacaoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtém o ID do robô dos parâmetros da rota

  // Garante que o ID seja uma string
  const roboId = typeof id === 'string' ? id : '';

  const { colorScheme } = useContext(ThemeContext);
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const queryClient = useQueryClient();

  // Busca os detalhes do robô
  const { data: robo, isLoading, isError, error } = useQuery<Robo, Error>({
    queryKey: ['robo', roboId],
    queryFn: () => fetchRoboById(roboId),
    enabled: !!roboId, // Só executa a query se o roboId existir
  });

  // Mutação para atualizar o status do robô
  const updateMutation = useMutation({
    mutationFn: updateRoboStatus,
    onSuccess: (data) => {
      Alert.alert('Sucesso', `Status do robô '${data.nome}' atualizado para: ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ['robo', roboId] }); // Invalida a query para buscar o robô novamente e refletir o novo status
      queryClient.invalidateQueries({ queryKey: ['robos'] }); // Opcional: invalida a lista geral de robôs
    },
    onError: (err) => {
      Alert.alert('Erro', `Não foi possível atualizar o status: ${err.message}`);
    },
  });

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert(
      'Confirmar Ação',
      `Deseja realmente definir o status do robô para "${newStatus}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => updateMutation.mutate({ id: roboId, newStatus }),
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={brandColors.primaryPurple} />
          <Text style={styles.statusText}>Carregando detalhes do robô...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={50} color={brandColors.danger} />
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorText}>{error?.message}</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!robo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <FontAwesome name="question-circle" size={50} color={brandColors.placeholder} />
          <Text style={styles.errorTitle}>Robô Não Encontrado</Text>
          <Text style={styles.statusText}>Verifique o ID fornecido.</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Botão de voltar no canto superior esquerdo */}
        <Pressable onPress={() => router.back()} style={styles.backArrow}>
          <FontAwesome
            name="arrow-left"
            size={24}
            color={isDarkMode ? brandColors.lightText : brandColors.darkText}
          />
        </Pressable>

        <Text style={styles.title}>Detalhes do Robô</Text>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>ID:</Text>
          <Text style={styles.detailValue}>{robo.id}</Text>

          <Text style={styles.detailLabel}>Nome:</Text>
          <Text style={styles.detailValue}>{robo.nome}</Text>

          <Text style={styles.detailLabel}>Tecnologia:</Text>
          <Text style={styles.detailValue}>{robo.tecnologia}</Text>
          
          {robo.status && (
             <>
               <Text style={styles.detailLabel}>Status Atual:</Text>
               <Text style={[styles.detailValue, styles.currentStatusText]}>{robo.status}</Text>
             </>
          )}
        </View>

        <Text style={styles.actionTitle}>Ações de Notificação</Text>
        
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.activateButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => handleUpdateStatus('Ativado')}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color={brandColors.lightText} />
            ) : (
              <Text style={styles.actionButtonText}>Ativar Robô</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deactivateButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => handleUpdateStatus('Desativado')}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.actionButtonText}>Desativar Robô</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.rebootButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => handleUpdateStatus('Reiniciando')}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.actionButtonText}>Reiniciar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // Ajuste para iOS Safe Area
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 20 : 0, // Ajuste para centralizar o título
  },
  detailCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    // Sombra para iOS e Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    marginTop: 10,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    marginBottom: 5,
  },
  currentStatusText: {
    color: brandColors.primaryPurple, // Destaca o status atual
    fontWeight: 'bold',
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    marginBottom: 15,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'column', // Botões empilhados
    gap: 10, // Espaçamento entre os botões
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }], // Pequeno efeito de clique
  },
  actionButtonText: {
    color: brandColors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  activateButton: {
    backgroundColor: brandColors.primaryPurple,
  },
  deactivateButton: {
    backgroundColor: brandColors.darkGray,
  },
  rebootButton: {
    backgroundColor: brandColors.danger, // Pode usar o roxo ou um vermelho de atenção
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: isDarkMode ? brandColors.cardBackgroundDark : brandColors.cardBackgroundLight,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: brandColors.danger,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: isDarkMode ? brandColors.lightText : brandColors.darkText,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: brandColors.placeholder,
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: brandColors.primaryPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    color: brandColors.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});