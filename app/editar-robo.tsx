import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
};

// --- Funções da API ---

const fetchRoboById = async (id: string): Promise<Robo> => {
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar o robô com ID ${id}`);
  }
  return response.json();
};

const updateRobo = async (roboData: Robo): Promise<Robo> => {
  const { id, ...dataToUpdate } = roboData;
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

// NOVO: Função para excluir um robô
const deleteRobo = async (id: string): Promise<void> => {
  const response = await fetch(`https://api-robo-production.up.railway.app/robos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Falha ao excluir o robô: ${errorData}`);
  }
};

// --- Componente da Tela de Edição ---

export default function EditarRoboScreen() {
  const queryClient = useQueryClient();
  
  const [id, setId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tecnologia, setTecnologia] = useState('');
  // NOVO: Estado para controlar a visibilidade do modal de confirmação
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roboId = params.get('id');
    setId(roboId);
  }, []);

  const { data: robo, isLoading, isError, error } = useQuery<Robo, Error>({
    queryKey: ['robo', id],
    queryFn: () => fetchRoboById(id as string),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: updateRobo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robos'] });
      window.history.back();
    },
    onError: (err) => {
      alert(`Erro ao salvar: ${err.message}`);
    }
  });

  // NOVO: 'Mutation' para lidar com a exclusão
  const deleteMutation = useMutation({
    mutationFn: deleteRobo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robos'] });
      window.history.back();
    },
    onError: (err) => {
      alert(`Erro ao excluir: ${err.message}`);
    }
  });

  useEffect(() => {
    if (robo) {
      setNome(robo.nome);
      setTecnologia(robo.tecnologia);
    }
  }, [robo]);

  const handleSave = () => {
    if (!nome || !tecnologia) {
      alert('Preencha todos os campos.');
      return;
    }
    if (id) {
      updateMutation.mutate({ id, nome, tecnologia });
    }
  };

  // NOVO: Funções para controlar a exclusão
  const handleDelete = () => {
    setDeleteModalVisible(true); // Abre o modal de confirmação
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
    setDeleteModalVisible(false);
  };

  if (isLoading) return <p style={styles.statusText}>Carregando robô...</p>;
  if (isError) return <p style={{...styles.statusText, ...styles.errorText}}>Erro ao carregar: {error?.message}</p>;

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        <h1 style={styles.title}>Editar Robô</h1>
        <div style={styles.form}>
          <label style={styles.label}>Nome do Robô</label>
          <input type="text" style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} />
          <label style={styles.label}>Tecnologia</label>
          <input type="text" style={styles.input} value={tecnologia} onChange={(e) => setTecnologia(e.target.value)} />
          <div style={styles.buttonContainer}>
            {/* NOVO: Botão de Excluir */}
            <button onClick={handleDelete} disabled={deleteMutation.isPending} style={{...styles.button, ...styles.deleteButton}}>
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </button>
            <div style={styles.actionsGroup}>
              <button onClick={() => window.history.back()} style={{...styles.button, ...styles.cancelButton}}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={updateMutation.isPending} style={styles.button}>
                {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOVO: Modal de Confirmação de Exclusão */}
      {isDeleteModalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Confirmar Exclusão</h2>
            <p style={styles.modalText}>Você tem certeza que deseja excluir o robô "{robo?.nome}"? Esta ação não pode ser desfeita.</p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModalVisible(false)} style={{...styles.button, ...styles.cancelButton}}>
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} style={{...styles.button, ...styles.deleteButton}}>
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  safeArea: { display: 'flex', flex: 1, backgroundColor: '#121212', color: '#FFFFFF', fontFamily: 'sans-serif', minHeight: '100vh' },
  container: { padding: '20px', width: '100%', maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' },
  input: { backgroundColor: '#1E1E1E', border: '1px solid #444', borderRadius: '8px', padding: '12px', color: '#FFFFFF', fontSize: '16px', width: '100%', boxSizing: 'border-box' },
  buttonContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '20px' },
  actionsGroup: { display: 'flex', gap: '10px' },
  button: { border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  cancelButton: { backgroundColor: '#555', color: 'white' },
  deleteButton: { backgroundColor: '#D9534F', color: 'white' },
  statusText: { textAlign: 'center', color: '#A0A0A0', fontSize: '16px' },
  errorText: { color: '#FF6347' },
  // NOVO: Estilos para o Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#1E1E1E', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '400px', border: '1px solid #444' },
  modalTitle: { margin: 0, marginBottom: '15px', fontSize: '22px' },
  modalText: { marginBottom: '25px', color: '#A0A0A0', lineHeight: 1.5 },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
};

