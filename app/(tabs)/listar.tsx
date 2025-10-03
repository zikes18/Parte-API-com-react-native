import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// O código fornecido era para React Native. Esta versão foi adaptada para a web,
// substituindo componentes nativos por elementos JSX padrão (div, input, etc.)
// e mantendo a lógica de busca de dados com @tanstack/react-query.

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
};

// ALTERADO: Função de busca de dados mais robusta para lidar com respostas não-JSON.
const fetchRobos = async (): Promise<Robo[]> => {
  const response = await fetch('https://api-robo-production.up.railway.app/robos');

  if (!response.ok) {
    throw new Error(`Falha ao buscar os dados da API (Status: ${response.status})`);
  }

  const responseText = await response.text(); // Primeiro, pegamos a resposta como texto.
  try {
    const data = JSON.parse(responseText);
    // Se a API for paginada, os dados geralmente vêm dentro de uma propriedade "content".
    if (data && Array.isArray(data.content)) {
      return data.content;
    }
    // Se a resposta for um array simples, retorna diretamente.
    if (Array.isArray(data)) {
      return data;
    }
    // Se nenhum dos formatos esperados for encontrado, lança um erro.
    throw new Error("A resposta JSON não continha o formato esperado (array ou objeto com 'content').");
  } catch (e) {
    // Se a conversão falhar, a resposta não era um JSON válido.
    console.error("A resposta da API não é um JSON válido:", responseText);
    // Lançamos um erro claro para ser exibido na tela.
    throw new Error(`Formato de resposta inesperado da API. Resposta: "${responseText.substring(0, 100)}..."`);
  }
};


export default function ListarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);

  // Hook do TanStack Query para buscar, cachear e gerenciar os dados da API.
  const { data: robos, isLoading, isError, error } = useQuery<Robo[], Error>({
    queryKey: ['robos'], // Chave única para esta busca, usada para cache.
    queryFn: fetchRobos,
  });

  // Efeito que filtra os robôs sempre que a lista original (vinda da API) ou o texto da busca mudam.
  useEffect(() => {
    if (robos) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = searchQuery.trim() === ''
        ? robos
        : robos.filter(
            (robo) =>
              robo.nome.toLowerCase().includes(lowerCaseQuery) ||
              robo.tecnologia.toLowerCase().includes(lowerCaseQuery)
          );
      setFilteredRobos(filtered);
    }
  }, [searchQuery, robos]);

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Robôs Cadastrados</h1>
          {/* Usamos uma tag <a> para navegação na web */}
          <a href="/enviar" style={styles.buttonLink}>
            Cadastrar Novo Robô
          </a>
        </div>

        <input
          type="text"
          style={styles.searchInput}
          placeholder="Pesquisar por nome ou tecnologia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={styles.listContainer}>
          {isLoading && <p style={styles.statusText}>Carregando robôs...</p>}
          {isError && <p style={{...styles.statusText, ...styles.errorText}}>Erro ao carregar: {error?.message}</p>}
          {!isLoading && !isError && (
            <ul>
              {filteredRobos.length > 0 ? (
                filteredRobos.map((robo) => (
                  <li key={robo.id} style={styles.roboCard}>
                    <div style={styles.roboInfo}>
                      <p style={styles.roboName}>{robo.nome}</p>
                      <p style={styles.roboTech}>{robo.tecnologia}</p>
                    </div>
                    {/* NOVO: Botão para navegar para a tela de edição */}
                    <a href={`/editar-robo?id=${robo.id}`} style={styles.editButton}>
                      Editar
                    </a>
                  </li>
                ))
              ) : (
                <p style={styles.statusText}>Nenhum robô encontrado.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Estilos CSS-in-JS para a versão web.
const styles: { [key: string]: React.CSSProperties } = {
  safeArea: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#121212',
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
    minHeight: '100vh',
  },
  container: {
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonLink: {
    backgroundColor: '#00A2FF',
    color: '#FFFFFF',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '12px',
    color: '#FFFFFF',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '24px',
  },
  listContainer: {
    width: '100%',
  },
  statusText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: '16px',
  },
  errorText: {
    color: '#FF6347', // Vermelho para erros
  },
  roboCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #444',
    marginBottom: '10px',
    listStyle: 'none',
  },
  roboInfo: {
    flex: 1,
  },
  roboName: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
  roboTech: {
    fontSize: '14px',
    color: '#A0A0A0',
    margin: '4px 0 0 0',
  },
  // NOVO: Estilo para o botão de editar
  editButton: {
    backgroundColor: '#f0ad4e',
    color: '#FFFFFF',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    fontWeight: 'bold',
    marginLeft: '10px',
    whiteSpace: 'nowrap',
  },
};

