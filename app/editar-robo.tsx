import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
};

// --- Funções da API ---

// Busca um único robô pelo seu ID
const fetchRoboById = async (id: string): Promise<Robo> => {
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar o robô com ID ${id}`);
  }
  return response.json();
};

// Atualiza os dados de um robô
const updateRobo = async (roboData: Robo): Promise<Robo> => {
  const { id, ...dataToUpdate } = roboData;
  // CORREÇÃO: Adicionado '/robos' na URL da requisição.
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToUpdate),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Falha ao atualizar o robô: ${errorData}`);
  }
  return response.json();
};


// --- Componente da Tela de Edição ---

export default function EditarRoboScreen() {
  const queryClient = useQueryClient();
  
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roboId = params.get('id');
    setId(roboId);
  }, []);


  // Estado para os campos do formulário
  const [nome, setNome] = useState('');
  const [tecnologia, setTecnologia] = useState('');

  // Busca os dados do robô específico que será editado
  const { data: robo, isLoading, isError, error } = useQuery<Robo, Error>({
    queryKey: ['robo', id],
    queryFn: () => fetchRoboById(id as string),
    enabled: !!id, // A query só é executada se o 'id' existir
  });

  // 'Mutation' para lidar com a lógica de atualização dos dados
  const mutation = useMutation({
    mutationFn: updateRobo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robos'] });
      window.history.back();
    },
    onError: (err) => {
      alert(`Erro ao salvar: ${err.message}`);
    }
  });

  // Efeito que preenche o formulário quando os dados do robô são carregados
  useEffect(() => {
    if (robo) {
      setNome(robo.nome);
      setTecnologia(robo.tecnologia);
    }
  }, [robo]);

  // Função chamada ao clicar no botão "Salvar"
  const handleSave = () => {
    if (!nome || !tecnologia) {
      alert('Preencha todos os campos.');
      return;
    }
    if (id) {
        mutation.mutate({ id, nome, tecnologia });
    }
  };

  if (isLoading) return <p style={styles.statusText}>Carregando robô...</p>;
  if (isError) return <p style={{...styles.statusText, ...styles.errorText}}>Erro ao carregar: {error?.message}</p>;

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        <h1 style={styles.title}>Editar Robô</h1>
        <div style={styles.form}>
          <label style={styles.label}>Nome do Robô</label>
          <input
            type="text"
            style={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label style={styles.label}>Tecnologia</label>
          <input
            type="text"
            style={styles.input}
            value={tecnologia}
            onChange={(e) => setTecnologia(e.target.value)}
          />

          <div style={styles.buttonContainer}>
            <button onClick={() => window.history.back()} style={{...styles.button, ...styles.cancelButton}}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={mutation.isPending} style={styles.button}>
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos para a tela de edição
const styles: { [key: string]: React.CSSProperties } = {
  safeArea: { display: 'flex', flex: 1, backgroundColor: '#121212', color: '#FFFFFF', fontFamily: 'sans-serif', minHeight: '100vh' },
  container: { padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' },
  input: { backgroundColor: '#1E1E1E', border: '1px solid #444', borderRadius: '8px', padding: '12px', color: '#FFFFFF', fontSize: '16px', width: '100%', boxSizing: 'border-box' },
  buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  button: { backgroundColor: '#00A2FF', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  cancelButton: { backgroundColor: '#555' },
  statusText: { textAlign: 'center', color: '#A0A0A0', fontSize: '16px' },
  errorText: { color: '#FF6347' },
};

