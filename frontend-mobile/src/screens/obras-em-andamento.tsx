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

interface Obra {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
  dataInicio: string;
  progresso: number;
  analistas: number;
}

interface ObrasEmAndamentoScreenProps {
  onObraSelect: (obra: Obra) => void;
  onBack?: () => void;
}

const ObrasEmAndamentoScreen: React.FC<ObrasEmAndamentoScreenProps> = ({ 
  onObraSelect, 
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const [obras] = React.useState<Obra[]>([
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
      id: '5',
      nome: 'Estação Tatuapé',
      descricao: 'Modernização da estação Tatuapé',
      localizacao: 'Rua Tuiuti, 1000 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '20/02/2024',
      progresso: 0.25,
      analistas: 1
    },
    {
      id: '6',
      nome: 'Viaduto Santa Ifigênia',
      descricao: 'Reforma estrutural do Viaduto Santa Ifigênia',
      localizacao: 'Viaduto Santa Ifigênia - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '10/03/2024',
      progresso: 0.15,
      analistas: 2
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return '#1976d2';
      default:
        return '#1976d2';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'clock';
      default:
        return 'clock';
    }
  };

  const filteredObras = obras.filter(obra =>
    obra.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obra.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obra.localizacao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderObraCard = (obra: Obra) => (
    <TouchableOpacity 
      key={obra.id} 
      onPress={() => onObraSelect(obra)}
      style={styles.obraCardContainer}
    >
      <Card style={styles.obraCard}>
        <Card.Content>
          {/* Header com nome e status */}
          <View style={styles.obraHeader}>
            <Text variant="titleMedium" style={styles.obraNome} numberOfLines={2}>
              {obra.nome}
            </Text>
            <View style={styles.statusContainer}>
              <MaterialCommunityIcons 
                name={getStatusIcon(obra.status) as any}
                size={16}
                color={getStatusColor(obra.status)}
              />
              <Text 
                variant="bodySmall" 
                style={[styles.statusText, { color: getStatusColor(obra.status) }]}
              >
                {obra.status}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          <Text variant="bodyMedium" style={styles.obraDescricao} numberOfLines={2}>
            {obra.descricao}
          </Text>

          {/* Localização */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText} numberOfLines={1}>
              {obra.localizacao}
            </Text>
          </View>

          {/* Data de início */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              Iniciada em {obra.dataInicio}
            </Text>
          </View>

          {/* Analistas */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {obra.analistas} analista(s)
            </Text>
          </View>

          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text variant="bodySmall" style={styles.progressLabel}>
                Progresso
              </Text>
              <Text variant="bodySmall" style={styles.progressText}>
                {Math.round(obra.progresso * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${obra.progresso * 100}%`,
                    backgroundColor: getStatusColor(obra.status)
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
                Obras em Andamento
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                Selecione uma obra para tirar fotos
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Busca */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar obras em andamento..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
        </View>

        {/* Lista de Obras */}
        <View style={styles.obrasList}>
          {filteredObras.length > 0 ? (
            filteredObras.map(renderObraCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="hammer" size={64} color="#ccc" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Nenhuma obra em andamento encontrada
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
  obrasList: {
    gap: 16,
    paddingBottom: 20,
  },
  obraCardContainer: {
    elevation: 2,
    borderRadius: 12,
  },
  obraCard: {
    elevation: 3,
    borderRadius: 12,
  },
  obraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  obraNome: {
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
  obraDescricao: {
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

export default ObrasEmAndamentoScreen;
