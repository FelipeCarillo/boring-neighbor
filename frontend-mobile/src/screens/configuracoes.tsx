import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { 
  Text, 
  Card, 
  Avatar,
  IconButton,
  Chip,
  Searchbar,
  Menu,
  Divider,
  FAB
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnalistaViewScreen from './analista-view';
import AnalistaEditScreen from './analista-edit';
import AnalistaPermissoesScreen from './analista-permissoes';
import NovoAnalistaScreen from './novo-analista';

const { width } = Dimensions.get('window');

interface Analista {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataCargo: string;
  status: 'Ativo' | 'Inativo';
  obras: string[];
  ultimoAcesso: string;
}

const ConfiguracoesScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos os Status');
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [showAnalistaView, setShowAnalistaView] = React.useState(false);
  const [showAnalistaEdit, setShowAnalistaEdit] = React.useState(false);
  const [showAnalistaPermissoes, setShowAnalistaPermissoes] = React.useState(false);
  const [showNovoAnalista, setShowNovoAnalista] = React.useState(false);
  const [selectedAnalista, setSelectedAnalista] = React.useState<Analista | null>(null);

  const [analistas] = React.useState<Analista[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@metrosp.com.br',
      telefone: '(11) 99999-9999',
      cargo: 'Analista Senior',
      dataCargo: '14/03/2020',
      status: 'Ativo',
      obras: ['Estação São Paulo-Morumbi', 'Estação Faria Lima'],
      ultimoAcesso: '2024-01-15 14:30'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@metrosp.com.br',
      telefone: '(11) 88888-8888',
      cargo: 'Analista Pleno',
      dataCargo: '10/06/2021',
      status: 'Ativo',
      obras: ['Estação São Paulo-Morumbi'],
      ultimoAcesso: '2024-01-15 16:45'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@metrosp.com.br',
      telefone: '(11) 77777-7777',
      cargo: 'Analista Junior',
      dataCargo: '15/09/2022',
      status: 'Ativo',
      obras: ['Túnel Avenida Paulista'],
      ultimoAcesso: '2024-01-15 10:15'
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      email: 'ana.oliveira@metrosp.com.br',
      telefone: '(11) 66666-6666',
      cargo: 'Analista Senior',
      dataCargo: '20/01/2019',
      status: 'Inativo',
      obras: [],
      ultimoAcesso: '2023-11-30 17:20'
    },
    {
      id: '5',
      nome: 'Carlos Lima',
      email: 'carlos.lima@metrosp.com.br',
      telefone: '(11) 55555-5555',
      cargo: 'Analista Pleno',
      dataCargo: '05/03/2021',
      status: 'Ativo',
      obras: ['Viaduto do Chá'],
      ultimoAcesso: '2024-01-14 09:30'
    }
  ]);

  const statusOptions = [
    'Todos os Status',
    'Ativo',
    'Inativo'
  ];

  const estatisticas = [
    { titulo: 'Total de Analistas', valor: '5', cor: '#2196f3', icone: 'account-group' },
    { titulo: 'Analistas Ativos', valor: '4', cor: '#4caf50', icone: 'account-check' },
    { titulo: 'Analistas Senior', valor: '2', cor: '#2196f3', icone: 'account-star' },
    { titulo: 'Obras Atribuídas', valor: '5', cor: '#2196f3', icone: 'file-document-multiple' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return '#4caf50';
      case 'Inativo':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'check-circle';
      case 'Inativo':
        return 'close-circle';
      default:
        return 'clock';
    }
  };

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case 'Analista Senior':
        return '#ff9800';
      case 'Analista Pleno':
        return '#2196f3';
      case 'Analista Junior':
        return '#4caf50';
      default:
        return '#666';
    }
  };

  const filteredAnalistas = analistas.filter(analista => {
    const matchesSearch = analista.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analista.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analista.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos os Status' || analista.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVisualizar = (analista: Analista) => {
    setSelectedAnalista(analista);
    setShowAnalistaView(true);
  };

  const handleEditar = (analista: Analista) => {
    setSelectedAnalista(analista);
    setShowAnalistaEdit(true);
  };

  const handlePermissoes = (analista: Analista) => {
    setSelectedAnalista(analista);
    setShowAnalistaPermissoes(true);
  };

  const handleNovoAnalista = () => {
    setShowNovoAnalista(true);
  };

  const handleBackFromView = () => {
    setShowAnalistaView(false);
    setSelectedAnalista(null);
  };

  const handleBackFromEdit = () => {
    setShowAnalistaEdit(false);
    setSelectedAnalista(null);
  };

  const handleBackFromPermissoes = () => {
    setShowAnalistaPermissoes(false);
    setSelectedAnalista(null);
  };

  const handleBackFromNovo = () => {
    setShowNovoAnalista(false);
  };

  const handleAnalistaEditado = (analistaEditado: any) => {
    console.log('Analista editado:', analistaEditado);
    Alert.alert('Sucesso!', 'Analista atualizado com sucesso!');
    setShowAnalistaEdit(false);
    setSelectedAnalista(null);
  };

  const handlePermissoesSalvas = (permissoes: any) => {
    console.log('Permissões salvas:', permissoes);
    Alert.alert('Sucesso!', 'Permissões atualizadas com sucesso!');
    setShowAnalistaPermissoes(false);
    setSelectedAnalista(null);
  };

  const handleAnalistaCriado = (novoAnalista: any) => {
    console.log('Novo analista criado:', novoAnalista);
    Alert.alert('Sucesso!', 'Analista criado com sucesso!');
    setShowNovoAnalista(false);
  };

  const renderEstatisticaCard = (stat: any, index: number) => (
    <Card key={index} style={[styles.statCard, { width: (width - 48) / 2 }]}>
      <Card.Content style={styles.statCardContent}>
        <MaterialCommunityIcons 
          name={stat.icone as any} 
          size={24} 
          color={stat.cor} 
        />
        <Text variant="headlineMedium" style={[styles.statValue, { color: stat.cor }]}>
          {stat.valor}
        </Text>
        <Text variant="bodySmall" style={styles.statTitle}>
          {stat.titulo}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderAnalistaCard = (analista: Analista) => (
    <Card key={analista.id} style={styles.analistaCard}>
      <Card.Content>
        {/* Header com avatar, nome e status */}
        <View style={styles.analistaHeader}>
          <View style={styles.analistaInfo}>
            <Avatar.Text 
              size={40} 
              label={analista.nome.split(' ').map(n => n[0]).join('')}
              style={[styles.avatar, { backgroundColor: getCargoColor(analista.cargo) }]}
            />
            <View style={styles.analistaDetails}>
              <Text variant="titleMedium" style={styles.analistaNome}>
                {analista.nome}
              </Text>
              <Text variant="bodySmall" style={styles.analistaEmail}>
                {analista.email}
              </Text>
              <Text variant="bodySmall" style={styles.analistaTelefone}>
                {analista.telefone}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons 
              name={getStatusIcon(analista.status) as any}
              size={14}
              color={getStatusColor(analista.status)}
            />
            <View style={[styles.statusChip, { 
              backgroundColor: 'transparent',
              borderColor: getStatusColor(analista.status),
              borderWidth: 1,
            }]}>
              <Text style={[styles.statusText, { color: getStatusColor(analista.status) }]}>
                {analista.status}
              </Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Cargo e data */}
        <View style={styles.cargoContainer}>
          <View style={styles.cargoInfo}>
            <Text variant="bodyMedium" style={[styles.cargoText, { color: getCargoColor(analista.cargo) }]}>
              {analista.cargo}
            </Text>
            <Text variant="bodySmall" style={styles.dataCargo}>
              Desde {analista.dataCargo}
            </Text>
          </View>
        </View>

        {/* Obras atribuídas */}
        <View style={styles.obrasContainer}>
          <Text variant="bodySmall" style={styles.obrasLabel}>
            Obras Atribuídas:
          </Text>
          <Text variant="bodySmall" style={styles.obrasCount}>
            {analista.obras.length} obra(s)
          </Text>
          {analista.obras.length > 0 && (
            <View style={styles.obrasList}>
              {analista.obras.map((obra, index) => (
                <Text key={index} variant="bodySmall" style={styles.obraItem} numberOfLines={1}>
                  • {obra}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Último acesso */}
        <View style={styles.ultimoAcessoContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
          <Text variant="bodySmall" style={styles.ultimoAcessoText}>
            Último acesso: {analista.ultimoAcesso}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleVisualizar(analista)}
          >
            <MaterialCommunityIcons name="eye" size={18} color="#2196f3" />
            <Text variant="bodySmall" style={styles.actionText}>
              Visualizar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditar(analista)}
          >
            <MaterialCommunityIcons name="pencil" size={18} color="#ff9800" />
            <Text variant="bodySmall" style={styles.actionText}>
              Editar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handlePermissoes(analista)}
          >
            <MaterialCommunityIcons name="account-cog" size={18} color="#9c27b0" />
            <Text variant="bodySmall" style={styles.actionText}>
              Permissões
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Renderizar telas condicionais */}
      {showAnalistaView && selectedAnalista && (
        <AnalistaViewScreen
          analista={selectedAnalista}
          onBack={handleBackFromView}
          onEdit={handleEditar}
          onPermissoes={handlePermissoes}
        />
      )}

      {showAnalistaEdit && selectedAnalista && (
        <AnalistaEditScreen
          analista={selectedAnalista}
          onBack={handleBackFromEdit}
          onSave={handleAnalistaEditado}
        />
      )}

      {showAnalistaPermissoes && selectedAnalista && (
        <AnalistaPermissoesScreen
          analista={selectedAnalista}
          onBack={handleBackFromPermissoes}
          onSave={handlePermissoesSalvas}
        />
      )}

      {showNovoAnalista && (
        <NovoAnalistaScreen
          onBack={handleBackFromNovo}
          onAnalistaCriado={handleAnalistaCriado}
        />
      )}

      {/* Tela principal de configurações */}
      {!showAnalistaView && !showAnalistaEdit && !showAnalistaPermissoes && !showNovoAnalista && (
        <>
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
            Configurações
          </Text>
          <Text variant="titleLarge" style={styles.subsectionTitle}>
            Configurações dos Analistas
          </Text>
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>
            Gerencie analistas, permissões e configurações do sistema
          </Text>
        </View>

        {/* Cards de Estatísticas */}
        <View style={styles.statsContainer}>
          {estatisticas.map(renderEstatisticaCard)}
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <Searchbar
            placeholder="Buscar analistas..."
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
                <MaterialCommunityIcons name="account" size={16} color="#2196f3" />
                <Text variant="bodyMedium" style={styles.filterText}>
                  {statusFilter}
                </Text>
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

        {/* Lista de Analistas */}
        <View style={styles.analistasList}>
          {filteredAnalistas.length > 0 ? (
            filteredAnalistas.map(renderAnalistaCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-group-outline" size={64} color="#ccc" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Nenhum analista encontrado
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Tente ajustar os filtros de busca
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB para novo analista */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleNovoAnalista}
        label="Novo Analista"
      />
        </>
      )}
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
    marginBottom: 8,
  },
  subsectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    textAlign: 'center',
    color: '#666',
  },
  filtersContainer: {
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
  analistasList: {
    gap: 16,
    paddingBottom: 100,
  },
  analistaCard: {
    elevation: 3,
    borderRadius: 12,
  },
  analistaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  analistaInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  analistaDetails: {
    flex: 1,
  },
  analistaNome: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  analistaEmail: {
    color: '#666',
    marginBottom: 2,
  },
  analistaTelefone: {
    color: '#666',
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
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
  },
  cargoContainer: {
    marginBottom: 12,
  },
  cargoInfo: {
    gap: 4,
  },
  cargoText: {
    fontWeight: '600',
  },
  dataCargo: {
    color: '#666',
  },
  obrasContainer: {
    marginBottom: 12,
  },
  obrasLabel: {
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  obrasCount: {
    color: '#2196f3',
    fontWeight: '600',
    marginBottom: 8,
  },
  obrasList: {
    gap: 2,
  },
  obraItem: {
    color: '#666',
    marginLeft: 8,
  },
  ultimoAcessoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  ultimoAcessoText: {
    color: '#666',
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

export default ConfiguracoesScreen;
