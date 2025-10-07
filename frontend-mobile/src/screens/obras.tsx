  import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Dimensions 
} from 'react-native';
import { 
  Text, 
  Card, 
  ProgressBar, 
  Avatar,
  IconButton,
  Chip,
  FAB,
  Searchbar,
  Menu,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Obra {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  dataInicio: string;
  dataFim: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
  progresso: number;
  analistas: number;
}

interface ObrasScreenProps {
  onNavigateToCamera?: (obra: Obra) => void;
}

const ObrasScreen: React.FC<ObrasScreenProps> = ({ onNavigateToCamera }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos os Status');
  const [menuVisible, setMenuVisible] = React.useState(false);

  const [obras] = React.useState<Obra[]>([
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      descricao: 'Construção da estação São Paulo-Morumbi da Linha 4-Amarela',
      localizacao: 'Av. Morumbi, 1000 - São Paulo, SP',
      dataInicio: '14/01/2024',
      dataFim: '29/06/2025',
      status: 'Em Andamento',
      progresso: 0.65,
      analistas: 2
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      descricao: 'Perfuração do túnel sob a Avenida Paulista',
      localizacao: 'Av. Paulista, 500 - São Paulo, SP',
      dataInicio: '31/01/2024',
      dataFim: '30/12/2025',
      status: 'Em Andamento',
      progresso: 0.45,
      analistas: 1
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima',
      localizacao: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      dataInicio: '09/08/2023',
      dataFim: '14/03/2024',
      status: 'Concluída',
      progresso: 1.0,
      analistas: 2
    },
    {
      id: '4',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      localizacao: 'Viaduto do Chá - São Paulo, SP',
      dataInicio: '29/02/2024',
      dataFim: '30/08/2024',
      status: 'Pausada',
      progresso: 0.30,
      analistas: 1
    }
  ]);

  const statusOptions = [
    'Todos os Status',
    'Em Andamento',
    'Concluída',
    'Pausada',
    'Planejada'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return '#4caf50';
      case 'Em Andamento':
        return '#2196f3';
      case 'Pausada':
        return '#ff9800';
      case 'Planejada':
        return '#9e9e9e';
      default:
        return '#2196f3';
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
        return 'calendar-clock';
      default:
        return 'clock';
    }
  };

  const filteredObras = obras.filter(obra => {
    const matchesSearch = obra.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         obra.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         obra.localizacao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos os Status' || obra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderObraCard = (obra: Obra) => (
    <Card key={obra.id} style={styles.obraCard}>
      <Card.Content>
        {/* Header com nome e status */}
        <View style={styles.obraHeader}>
          <Text variant="titleMedium" style={styles.obraNome} numberOfLines={2}>
            {obra.nome}
          </Text>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons 
              name={getStatusIcon(obra.status) as any}
              size={14}
              color={getStatusColor(obra.status)}
            />
            <View style={[styles.statusChip, { 
              backgroundColor: 'transparent',
              borderColor: getStatusColor(obra.status),
              borderWidth: 1,
            }]}>
              <Text style={[styles.statusText, { color: getStatusColor(obra.status) }]}>
                {obra.status}
              </Text>
            </View>
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

        {/* Datas */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={16} color="#666" />
          <Text variant="bodySmall" style={styles.infoText}>
            {obra.dataInicio} - {obra.dataFim}
          </Text>
        </View>

        {/* Analistas */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-group" size={16} color="#666" />
          <Text variant="bodySmall" style={styles.infoText}>
            {obra.analistas} analista(s)
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text variant="bodySmall" style={styles.progressLabel}>
              Progresso
            </Text>
            <Text variant="bodySmall" style={styles.progressText}>
              {Math.round(obra.progresso * 100)}%
            </Text>
          </View>
          <ProgressBar 
            progress={obra.progresso} 
            color={getStatusColor(obra.status)}
            style={styles.progressBar}
          />
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="eye" size={18} color="#2196f3" />
            <Text variant="bodySmall" style={styles.actionText}>
              Visualizar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="pencil" size={18} color="#ff9800" />
            <Text variant="bodySmall" style={styles.actionText}>
              Editar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (onNavigateToCamera) {
                onNavigateToCamera(obra);
              }
            }}
          >
            <MaterialCommunityIcons name="camera" size={18} color="#4caf50" />
            <Text variant="bodySmall" style={styles.actionText}>
              Tirar Foto
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="delete" size={18} color="#f44336" />
            <Text variant="bodySmall" style={styles.actionText}>
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Metrô Obras
          </Text>
          <View style={styles.userInfo}>
            <Avatar.Icon size={32} icon="account" style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text variant="bodyMedium" style={styles.userName}>
                Administrador
              </Text>
              <Text variant="bodySmall" style={styles.userRole}>
                ADMMaster
              </Text>
            </View>
            <IconButton
              icon="logout"
              size={20}
              onPress={() => {}}
              style={styles.logoutButton}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título da seção */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Lista de Obras
          </Text>
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>
            Gerencie todas as obras do sistema
          </Text>
        </View>

        {/* Busca e Filtro */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar obras..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setMenuVisible(true)}
              >
                <MaterialCommunityIcons name="filter" size={20} color="#2196f3" />
                <Text variant="bodyMedium" style={styles.filterText}>
                  {statusFilter}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#2196f3" />
              </TouchableOpacity>
            }
          >
            {statusOptions.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  setStatusFilter(option);
                  setMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </View>

        {/* Lista de Obras */}
        <View style={styles.obrasList}>
          {filteredObras.length > 0 ? (
            filteredObras.map(renderObraCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="file-document-outline" size={64} color="#ccc" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Nenhuma obra encontrada
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Tente ajustar os filtros de busca
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB para nova obra */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        label="Nova Obra"
      />
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
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  userDetails: {
    marginLeft: 8,
    marginRight: 8,
  },
  userName: {
    fontWeight: '600',
    color: '#fff',
  },
  userRole: {
    color: '#e3f2fd',
  },
  logoutButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    gap: 8,
    minWidth: 140,
  },
  filterText: {
    color: '#2196f3',
    fontWeight: '500',
    flex: 1,
  },
  obrasList: {
    gap: 16,
    paddingBottom: 100,
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
  statusChip: {
    height: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
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
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
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
    fontWeight: '600',
    color: '#2196f3',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
});

export default ObrasScreen;
