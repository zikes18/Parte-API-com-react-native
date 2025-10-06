import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

type Robo = {
  id: string;
  nome: string;
  tecnologia: string;
};

const fetchRobos = async (): Promise<Robo[]> => {
  const response = await fetch('https://api-robo-production.up.railway.app/robos');

  if (!response.ok) {
    throw new Error(`Falha ao buscar os dados da API (Status: ${response.status})`);
  }

  const responseText = await response.text();
  try {
    const data = JSON.parse(responseText);
    if (data && Array.isArray(data.content)) {
      return data.content;
    }
    if (Array.isArray(data)) {
      return data;
    }
    throw new Error("A resposta JSON não continha o formato esperado (array ou objeto com 'content').");
  } catch (e) {
    console.error("A resposta da API não é um JSON válido:", responseText);
    throw new Error(`Formato de resposta inesperado da API. Resposta: "${responseText.substring(0, 100)}..."`);
  }
};

// NOVO: Componente para injetar os estilos da barra de rolagem personalizada.
const CustomScrollbarStyles = () => (
  <style>
    {`
      /* Para navegadores baseados em WebKit (Chrome, Safari, Edge) */
      .robot-list-container::-webkit-scrollbar {
        width: 8px; /* Largura da barra de rolagem */
      }

      .robot-list-container::-webkit-scrollbar-track {
        background: transparent; /* Fundo da barra de rolagem invisível */
      }

      .robot-list-container::-webkit-scrollbar-thumb {
        background-color: transparent; /* Indicador de rolagem invisível por padrão */
        border-radius: 10px;
      }

      /* O indicador de rolagem aparece quando o mouse está sobre a lista */
      .robot-list-container:hover::-webkit-scrollbar-thumb {
        background-color: #555;
      }

      .robot-list-container::-webkit-scrollbar-thumb:hover {
        background-color: #777; /* Cor ao passar o mouse sobre o indicador */
      }

      /* Para Firefox */
      .robot-list-container {
        scrollbar-width: thin;
        scrollbar-color: #555 transparent;
      }
    `}
  </style>
);


export default function ListarScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRobos, setFilteredRobos] = useState<Robo[]>([]);

  const { data: robos, isLoading, isError, error } = useQuery<Robo[], Error>({
    queryKey: ['robos'],
    queryFn: fetchRobos,
  });

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
      {/* NOVO: Os estilos da barra de rolagem são adicionados aqui */}
      <CustomScrollbarStyles />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Robôs Cadastrados</h1>
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

        {/* ALTERADO: Adicionado um className para aplicar os estilos da barra de rolagem */}
        <div style={styles.listContainer} className="robot-list-container">
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

const styles: { [key: string]: React.CSSProperties } = {
  safeArea: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#121212',
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
    height: '100vh', // Garante que a div ocupe a altura toda
    overflow: 'hidden', // Impede a rolagem do corpo da página
  },
  container: {
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
  // ALTERADO: A lista agora tem altura máxima e rolagem vertical.
  listContainer: {
    flex: 1, // Faz o container da lista ocupar o espaço restante
    overflowY: 'auto', // Adiciona rolagem vertical quando o conteúdo excede o espaço
    paddingRight: '10px', // Espaço para evitar que a barra de rolagem sobreponha o conteúdo
  },
  statusText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: '16px',
  },
  errorText: {
    color: '#FF6347',
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