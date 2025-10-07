import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { 
  Text, 
  Card, 
  Avatar,
  IconButton,
  Searchbar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
  dataInicio: string;
  progresso: number;
  analistas: number;
}

interface SelecionarProjetoScreenProps {
  onProjetoSelect: (projeto: Projeto) => void;
  onBack?: () => void;
}

const SelecionarProjetoScreen: React.FC<SelecionarProjetoScreenProps> = ({ 
  onProjetoSelect, 
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const [projetos] = React.useState<Projeto[]>([
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      descricao: 'Construção da estação São Paulo-Morumbi da Linha 4-Amarela',
      localizacao: 'Av. Morumbi, 1000 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '14/01/2024',
      progresso: 0.65,
      analistas: 2
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      descricao: 'Perfuração do túnel sob a Avenida Paulista',
      localizacao: 'Av. Paulista, 500 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '31/01/2024',
      progresso: 0.45,
      analistas: 1
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima',
      localizacao: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '09/08/2023',
      progresso: 1.0,
      analistas: 2
    },
    {
      id: '4',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      localizacao: 'Viaduto do Chá - São Paulo, SP',
      status: 'Pausada',
      dataInicio: '15/03/2023',
      progresso: 0.30,
      analistas: 1
    },
    {
      id: '5',
      nome: 'Estação Tatuapé',
      descricao: 'Modernização da estação Tatuapé',
      localizacao: 'Rua Tuiuti, 1000 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '20/02/2024',
      progresso: 0.25,
      analistas: 1
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return '#4caf50';
      case 'Em Andamento':
        return '#1976d2';
      case 'Pausada':
        return '#ff9800';
      case 'Planejada':
        return '#9c27b0';
      default:
        return '#1976d2';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'check-circle';
      case 'Em Andamento':
        return 'clock';
      case 'Pausada':
        return 'pause-circle';
      case 'Planejada':
        return 'calendar';
      default:
        return 'clock';
    }
  };

  const filteredProjetos = projetos.filter(projeto =>
    projeto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    projeto.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    projeto.localizacao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProjetoCard = (projeto: Projeto) => (
    <TouchableOpacity 
      key={projeto.id} 
      onPress={() => onProjetoSelect(projeto)}
      style={styles.projetoCardContainer}
    >
      <Card style={styles.projetoCard}>
        <Card.Content>
          {/* Header com nome e status */}
          <View style={styles.projetoHeader}>
            <Text variant="titleMedium" style={styles.projetoNome} numberOfLines={2}>
              {projeto.nome}
            </Text>
            <View style={styles.statusContainer}>
              <MaterialCommunityIcons 
                name={getStatusIcon(projeto.status) as any}
                size={16}
                color={getStatusColor(projeto.status)}
              />
              <Text 
                variant="bodySmall" 
                style={[styles.statusText, { color: getStatusColor(projeto.status) }]}
              >
                {projeto.status}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          <Text variant="bodyMedium" style={styles.projetoDescricao} numberOfLines={2}>
            {projeto.descricao}
          </Text>

          {/* Localização */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText} numberOfLines={1}>
              {projeto.localizacao}
            </Text>
          </View>

          {/* Data de início */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              Iniciada em {projeto.dataInicio}
            </Text>
          </View>

          {/* Analistas */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {projeto.analistas} analista(s)
            </Text>
          </View>

          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text variant="bodySmall" style={styles.progressLabel}>
                Progresso
              </Text>
              <Text variant="bodySmall" style={styles.progressText}>
                {Math.round(projeto.progresso * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${projeto.progresso * 100}%`,
                    backgroundColor: getStatusColor(projeto.status)
                  }
                ]} 
              />
            </View>
          </View>

          {/* Botão de ação */}
          <View style={styles.actionContainer}>
            <MaterialCommunityIcons 
              name="camera" 
              size={20} 
              color="#1976d2" 
            />
            <Text variant="bodyMedium" style={styles.actionText}>
              Tirar Foto
            </Text>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={20} 
              color="#1976d2" 
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {onBack && (
              <IconButton
                icon="arrow-left"
                size={24}
                iconColor="#fff"
                onPress={onBack}
              />
            )}
            <View style={styles.headerTitleContainer}>
              <Text variant="headlineMedium" style={styles.headerTitle}>
                Selecionar Projeto
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                Escolha o projeto para tirar fotos
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Busca */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar projetos..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
        </View>

        {/* Lista de Projetos */}
        <View style={styles.projetosList}>
          {filteredProjetos.length > 0 ? (
            filteredProjetos.map(renderProjetoCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="hammer" size={64} color="#ccc" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Nenhum projeto encontrado
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Tente ajustar os termos de busca
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#e3f2fd',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
  },
  projetosList: {
    gap: 16,
    paddingBottom: 20,
  },
  projetoCardContainer: {
    elevation: 2,
    borderRadius: 12,
  },
  projetoCard: {
    elevation: 3,
    borderRadius: 12,
  },
  projetoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  projetoNome: {
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  projetoDescricao: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    color: '#666',
    flex: 1,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#666',
    fontWeight: '500',
  },
  progressText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionText: {
    color: '#1976d2',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999',
    textAlign: 'center',
  },
});

export default SelecionarProjetoScreen;
