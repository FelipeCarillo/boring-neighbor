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
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HistoricoDetalhesScreen from './historico-detalhes';

const { width } = Dimensions.get('window');

interface ObraHistorico {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  dataInicio: string;
  dataFim: string;
  status: 'Concluída' | 'Cancelada';
  analistas: number;
  documentos: number;
  observacoes: string;
  duracao: number; // em dias
}

const HistoricoScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos os Status');
  const [dataFilter, setDataFilter] = React.useState('Todas as Datas');
  const [statusMenuVisible, setStatusMenuVisible] = React.useState(false);
  const [dataMenuVisible, setDataMenuVisible] = React.useState(false);
  const [showDetalhes, setShowDetalhes] = React.useState(false);
  const [selectedObra, setSelectedObra] = React.useState<ObraHistorico | null>(null);

  const [obras] = React.useState<ObraHistorico[]>([
    {
      id: '1',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima da Linha 4-Amarela',
      localizacao: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      dataInicio: '09/08/2023',
      dataFim: '14/03/2024',
      status: 'Concluída',
      analistas: 2,
      documentos: 15,
      observacoes: 'Obra concluída dentro do prazo e orçamento previstos.',
      duracao: 218
    },
    {
      id: '2',
      nome: 'Túnel Rua Augusta',
      descricao: 'Perfuração do túnel sob a Rua Augusta',
      localizacao: 'Rua Augusta, 300 - São Paulo, SP',
      dataInicio: '14/01/2023',
      dataFim: '29/11/2023',
      status: 'Concluída',
      analistas: 2,
      documentos: 12,
      observacoes: 'Execução técnica excelente, sem intercorrências.',
      duracao: 319
    },
    {
      id: '3',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      localizacao: 'Viaduto do Chá - São Paulo, SP',
      dataInicio: '15/03/2023',
      dataFim: '10/06/2023',
      status: 'Cancelada',
      analistas: 1,
      documentos: 8,
      observacoes: 'Cancelada devido a problemas de licenciamento ambiental.',
      duracao: 87
    }
  ]);

  const statusOptions = [
    'Todos os Status',
    'Concluída',
    'Cancelada'
  ];

  const dataOptions = [
    'Todas as Datas',
    'Último Mês',
    'Últimos 3 Meses',
    'Último Ano',
    '2024',
    '2023'
  ];

  const estatisticas = [
    { titulo: 'Total de Obras', valor: '5', cor: '#2196f3', icone: 'file-document-multiple' },
    { titulo: 'Concluídas', valor: '4', cor: '#4caf50', icone: 'check-circle' },
    { titulo: 'Canceladas', valor: '1', cor: '#f44336', icone: 'close-circle' },
    { titulo: 'Total Documentos', valor: '60', cor: '#2196f3', icone: 'file-document' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return '#4caf50';
      case 'Cancelada':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'check-circle';
      case 'Cancelada':
        return 'close-circle';
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

  const handleDetalhes = (obra: ObraHistorico) => {
    setSelectedObra(obra);
    setShowDetalhes(true);
  };

  const handleRelatorio = (obra: ObraHistorico) => {
    Alert.alert(
      'Gerar Relatório',
      `Escolha o formato para o relatório de "${obra.nome}":`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'PDF', 
          onPress: () => {
            Alert.alert('Relatório PDF', 'Relatório em PDF gerado com sucesso!');
          }
        },
        { 
          text: 'Excel', 
          onPress: () => {
            Alert.alert('Relatório Excel', 'Relatório em Excel gerado com sucesso!');
          }
        },
        { 
          text: 'CSV', 
          onPress: () => {
            Alert.alert('Relatório CSV', 'Relatório em CSV gerado com sucesso!');
          }
        }
      ]
    );
  };

  const handleBackFromDetalhes = () => {
    setShowDetalhes(false);
    setSelectedObra(null);
  };

  const handleGerarRelatorio = (obra: any) => {
    console.log('Relatório gerado para:', obra.nome);
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

  const renderObraCard = (obra: ObraHistorico) => (
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

        {/* Informações detalhadas */}
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText} numberOfLines={1}>
              {obra.localizacao}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {obra.dataInicio} - {obra.dataFim}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {obra.analistas} analista(s)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="file-document" size={16} color="#666" />
            <Text variant="bodySmall" style={styles.infoText}>
              {obra.documentos} documentos
            </Text>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.observacoesContainer}>
          <Text variant="bodySmall" style={styles.observacoesLabel}>
            Observações:
          </Text>
          <Text variant="bodySmall" style={styles.observacoesText}>
            {obra.observacoes}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Duração e Ações */}
        <View style={styles.footerContainer}>
          <View style={styles.duracaoContainer}>
            <Text variant="bodySmall" style={styles.duracaoLabel}>
              Duração
            </Text>
            <Text variant="headlineSmall" style={styles.duracaoValue}>
              {obra.duracao} dias
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.detailsButton]}
              onPress={() => handleDetalhes(obra)}
            >
              <MaterialCommunityIcons name="eye" size={16} color="#fff" />
              <Text variant="bodySmall" style={styles.actionTextWhite}>
                Detalhes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.reportButton]}
              onPress={() => handleRelatorio(obra)}
            >
              <MaterialCommunityIcons name="download" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.actionTextGray}>
                Relatório
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Renderizar tela de detalhes se selecionada */}
      {showDetalhes && selectedObra && (
        <HistoricoDetalhesScreen
          obra={selectedObra}
          onBack={handleBackFromDetalhes}
          onGerarRelatorio={handleGerarRelatorio}
        />
      )}

      {/* Tela principal do histórico */}
      {!showDetalhes && (
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
            Histórico de Obras
          </Text>
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>
            Visualize o histórico completo de todas as obras do sistema
          </Text>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <Searchbar
            placeholder="Buscar obras..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
          
          <View style={styles.filterRow}>
            <Menu
              visible={statusMenuVisible}
              onDismiss={() => setStatusMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setStatusMenuVisible(true)}
                >
                  <MaterialCommunityIcons name="filter" size={16} color="#2196f3" />
                  <Text variant="bodySmall" style={styles.filterText}>
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
                    setStatusMenuVisible(false);
                  }}
                  title={option}
                />
              ))}
            </Menu>

            <Menu
              visible={dataMenuVisible}
              onDismiss={() => setDataMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setDataMenuVisible(true)}
                >
                  <MaterialCommunityIcons name="calendar" size={16} color="#2196f3" />
                  <Text variant="bodySmall" style={styles.filterText}>
                    {dataFilter}
                  </Text>
                </TouchableOpacity>
              }
            >
              {dataOptions.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setDataFilter(option);
                    setDataMenuVisible(false);
                  }}
                  title={option}
                />
              ))}
            </Menu>
          </View>
        </View>

        {/* Cards de Estatísticas */}
        <View style={styles.statsContainer}>
          {estatisticas.map(renderEstatisticaCard)}
        </View>

        {/* Lista de Obras do Histórico */}
        <View style={styles.historicoSection}>
          <Text variant="titleLarge" style={styles.historicoTitle}>
            Obras do Histórico
          </Text>
          <View style={styles.obrasList}>
            {filteredObras.length > 0 ? (
              filteredObras.map(renderObraCard)
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="history" size={64} color="#ccc" />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  Nenhuma obra encontrada
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtitle}>
                  Tente ajustar os filtros de busca
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  searchBar: {
    elevation: 2,
    marginBottom: 12,
  },
  searchInput: {
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    gap: 6,
    flex: 1,
  },
  filterText: {
    color: '#2196f3',
    fontWeight: '500',
    flex: 1,
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
  historicoSection: {
    marginBottom: 24,
  },
  historicoTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  obrasList: {
    gap: 16,
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
  detailsContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  infoText: {
    color: '#666',
    flex: 1,
  },
  observacoesContainer: {
    marginBottom: 12,
  },
  observacoesLabel: {
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  observacoesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  duracaoContainer: {
    alignItems: 'flex-start',
  },
  duracaoLabel: {
    color: '#666',
    marginBottom: 4,
  },
  duracaoValue: {
    fontWeight: 'bold',
    color: '#2196f3',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  detailsButton: {
    backgroundColor: '#2196f3',
  },
  reportButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionTextWhite: {
    color: '#fff',
    fontWeight: '500',
  },
  actionTextGray: {
    color: '#666',
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
});

export default HistoricoScreen;
