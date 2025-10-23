import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { 
  Text, 
  Card, 
  Button,
  IconButton,
  Chip,
  Portal,
  Modal,
  List,
  Divider,
  SegmentedButtons,
  ProgressBar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RelatoriosScreenProps {
  onBack: () => void;
}

interface RelatorioData {
  id: string;
  titulo: string;
  tipo: 'progresso' | 'financeiro' | 'equipe' | 'qualidade';
  periodo: string;
  dataGeracao: string;
  status: 'gerado' | 'processando' | 'erro';
}

interface Estatistica {
  titulo: string;
  valor: string;
  variacao: string;
  icone: string;
  cor: string;
  tendencia: 'up' | 'down' | 'stable';
}

const RelatoriosScreen: React.FC<RelatoriosScreenProps> = ({ onBack }) => {
  const [periodoSelecionado, setPeriodoSelecionado] = React.useState('mes');
  const [tipoRelatorio, setTipoRelatorio] = React.useState('todos');
  const [showFiltrosModal, setShowFiltrosModal] = React.useState(false);
  const [isGerandoRelatorio, setIsGerandoRelatorio] = React.useState(false);

  const { width } = Dimensions.get('window');

  const estatisticas: Estatistica[] = [
    {
      titulo: 'Obras Concluídas',
      valor: '12',
      variacao: '+15%',
      icone: 'check-circle',
      cor: '#4caf50',
      tendencia: 'up'
    },
    {
      titulo: 'Progresso Médio',
      valor: '68%',
      variacao: '+5%',
      icone: 'chart-line',
      cor: '#1976d2',
      tendencia: 'up'
    },
    {
      titulo: 'Analistas Ativos',
      valor: '18',
      variacao: '+2',
      icone: 'account-group',
      cor: '#ff9800',
      tendencia: 'up'
    },
    {
      titulo: 'Orçamento Utilizado',
      valor: 'R$ 2.4M',
      variacao: '-3%',
      icone: 'currency-usd',
      cor: '#9c27b0',
      tendencia: 'down'
    }
  ];

  const relatoriosGerados: RelatorioData[] = [
    {
      id: '1',
      titulo: 'Relatório de Progresso - Janeiro 2024',
      tipo: 'progresso',
      periodo: 'Janeiro 2024',
      dataGeracao: '01/02/2024',
      status: 'gerado'
    },
    {
      id: '2',
      titulo: 'Análise Financeira - Q4 2023',
      tipo: 'financeiro',
      periodo: 'Q4 2023',
      dataGeracao: '15/01/2024',
      status: 'gerado'
    },
    {
      id: '3',
      titulo: 'Performance da Equipe',
      tipo: 'equipe',
      periodo: 'Dezembro 2023',
      dataGeracao: '05/01/2024',
      status: 'gerado'
    },
    {
      id: '4',
      titulo: 'Relatório de Qualidade',
      tipo: 'qualidade',
      periodo: 'Janeiro 2024',
      dataGeracao: '28/01/2024',
      status: 'processando'
    }
  ];

  const tiposRelatorio = [
    { value: 'todos', label: 'Todos' },
    { value: 'progresso', label: 'Progresso' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'equipe', label: 'Equipe' },
    { value: 'qualidade', label: 'Qualidade' }
  ];

  const periodos = [
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mês' },
    { value: 'trimestre', label: 'Trimestre' },
    { value: 'ano', label: 'Ano' }
  ];

  const getTipoIcon = (tipo: string) => {
    const icons = {
      progresso: 'chart-line',
      financeiro: 'currency-usd',
      equipe: 'account-group',
      qualidade: 'shield-check'
    };
    return icons[tipo as keyof typeof icons] || 'file-document';
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      progresso: '#1976d2',
      financeiro: '#4caf50',
      equipe: '#ff9800',
      qualidade: '#9c27b0'
    };
    return colors[tipo as keyof typeof colors] || '#666';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      gerado: '#4caf50',
      processando: '#ff9800',
      erro: '#f44336'
    };
    return colors[status as keyof typeof colors] || '#666';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      gerado: 'check-circle',
      processando: 'clock',
      erro: 'alert-circle'
    };
    return icons[status as keyof typeof icons] || 'help-circle';
  };

  const handleGerarRelatorio = async () => {
    setIsGerandoRelatorio(true);
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        'Relatório Gerado!',
        'O relatório foi gerado com sucesso e está disponível para download.',
        [
          {
            text: 'Baixar',
            onPress: () => {
              Alert.alert('Download', 'Relatório baixado com sucesso!');
            }
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGerandoRelatorio(false);
    }
  };

  const handleExportarRelatorio = (relatorio: RelatorioData) => {
    Alert.alert(
      'Exportar Relatório',
      `Escolha o formato para exportar "${relatorio.titulo}":`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'PDF', 
          onPress: () => Alert.alert('Exportação', 'Relatório exportado em PDF!')
        },
        { 
          text: 'Excel', 
          onPress: () => Alert.alert('Exportação', 'Relatório exportado em Excel!')
        },
        { 
          text: 'CSV', 
          onPress: () => Alert.alert('Exportação', 'Relatório exportado em CSV!')
        }
      ]
    );
  };

  const filteredRelatorios = relatoriosGerados.filter(relatorio => 
    tipoRelatorio === 'todos' || relatorio.tipo === tipoRelatorio
  );

  const renderGraficoProgresso = () => (
    <Card style={styles.graficoCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.graficoTitle}>
          Progresso das Obras
        </Text>
        
        <View style={styles.graficoContainer}>
          {[
            { nome: 'Estação Morumbi', progresso: 0.75, cor: '#4caf50' },
            { nome: 'Túnel Paulista', progresso: 0.45, cor: '#1976d2' },
            { nome: 'Estação Faria Lima', progresso: 1.0, cor: '#4caf50' },
            { nome: 'Viaduto Marginal', progresso: 0.30, cor: '#ff9800' },
            { nome: 'Ponte Tietê', progresso: 0.60, cor: '#1976d2' }
          ].map((obra, index) => (
            <View key={index} style={styles.progressoItem}>
              <View style={styles.progressoHeader}>
                <Text variant="bodyMedium" style={styles.progressoNome}>
                  {obra.nome}
                </Text>
                <Text variant="bodySmall" style={styles.progressoPercent}>
                  {Math.round(obra.progresso * 100)}%
                </Text>
              </View>
              <ProgressBar 
                progress={obra.progresso} 
                color={obra.cor}
                style={styles.progressoBar}
              />
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderGraficoFinanceiro = () => (
    <Card style={styles.graficoCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.graficoTitle}>
          Análise Financeira
        </Text>
        
        <View style={styles.financeiroContainer}>
          <View style={styles.financeiroItem}>
            <Text variant="bodySmall" style={styles.financeiroLabel}>
              Orçamento Total
            </Text>
            <Text variant="headlineSmall" style={styles.financeiroValor}>
              R$ 15.2M
            </Text>
          </View>
          
          <View style={styles.financeiroItem}>
            <Text variant="bodySmall" style={styles.financeiroLabel}>
              Utilizado
            </Text>
            <Text variant="headlineSmall" style={[styles.financeiroValor, { color: '#4caf50' }]}>
              R$ 9.8M
            </Text>
          </View>
          
          <View style={styles.financeiroItem}>
            <Text variant="bodySmall" style={styles.financeiroLabel}>
              Restante
            </Text>
            <Text variant="headlineSmall" style={[styles.financeiroValor, { color: '#ff9800' }]}>
              R$ 5.4M
            </Text>
          </View>
        </View>
        
        <ProgressBar 
          progress={0.64} 
          color="#4caf50"
          style={styles.financeiroProgress}
        />
        <Text variant="bodySmall" style={styles.financeiroPercent}>
          64% do orçamento utilizado
        </Text>
      </Card.Content>
    </Card>
  );

  const renderGraficoEquipe = () => (
    <Card style={styles.graficoCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.graficoTitle}>
          Performance da Equipe
        </Text>
        
        <View style={styles.equipeContainer}>
          {[
            { especialidade: 'Estruturas', analistas: 8, obras: 12 },
            { especialidade: 'Geotecnia', analistas: 5, obras: 8 },
            { especialidade: 'Hidráulica', analistas: 3, obras: 6 },
            { especialidade: 'Elétrica', analistas: 4, obras: 7 },
            { especialidade: 'Mecânica', analistas: 2, obras: 4 }
          ].map((item, index) => (
            <View key={index} style={styles.equipeItem}>
              <View style={styles.equipeHeader}>
                <Text variant="bodyMedium" style={styles.equipeEspecialidade}>
                  {item.especialidade}
                </Text>
                <Text variant="bodySmall" style={styles.equipeStats}>
                  {item.analistas} analistas • {item.obras} obras
                </Text>
              </View>
              <View style={styles.equipeBars}>
                <View style={styles.equipeBar}>
                  <Text variant="bodySmall" style={styles.equipeBarLabel}>Analistas</Text>
                  <View style={styles.equipeBarContainer}>
                    <View 
                      style={[
                        styles.equipeBarFill, 
                        { width: `${(item.analistas / 8) * 100}%`, backgroundColor: '#1976d2' }
                      ]} 
                    />
                  </View>
                </View>
                <View style={styles.equipeBar}>
                  <Text variant="bodySmall" style={styles.equipeBarLabel}>Obras</Text>
                  <View style={styles.equipeBarContainer}>
                    <View 
                      style={[
                        styles.equipeBarFill, 
                        { width: `${(item.obras / 12) * 100}%`, backgroundColor: '#4caf50' }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={onBack}
            style={styles.backButton}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Relatórios
          </Text>
          <IconButton
            icon="filter"
            size={24}
            onPress={() => setShowFiltrosModal(true)}
            style={styles.filterButton}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estatísticas Principais */}
        <View style={styles.statsContainer}>
          {estatisticas.map((stat, index) => (
            <Card key={index} style={[styles.statCard, { width: (width - 48) / 2 }]}>
              <Card.Content style={styles.statContent}>
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
                <View style={styles.statVariacao}>
                  <MaterialCommunityIcons 
                    name={stat.tendencia === 'up' ? 'trending-up' : stat.tendencia === 'down' ? 'trending-down' : 'trending-neutral'} 
                    size={16} 
                    color={stat.tendencia === 'up' ? '#4caf50' : stat.tendencia === 'down' ? '#f44336' : '#666'} 
                  />
                  <Text 
                    variant="bodySmall" 
                    style={[
                      styles.variacaoText, 
                      { color: stat.tendencia === 'up' ? '#4caf50' : stat.tendencia === 'down' ? '#f44336' : '#666' }
                    ]}
                  >
                    {stat.variacao}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Botão Gerar Relatório */}
        <Card style={styles.actionCard}>
          <Card.Content>
            <View style={styles.actionHeader}>
              <MaterialCommunityIcons name="file-document-plus" size={24} color="#1976d2" />
              <Text variant="titleMedium" style={styles.actionTitle}>
                Gerar Novo Relatório
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.actionSubtitle}>
              Crie relatórios personalizados com base nos filtros selecionados
            </Text>
            <Button
              mode="contained"
              onPress={handleGerarRelatorio}
              style={styles.generateButton}
              loading={isGerandoRelatorio}
              disabled={isGerandoRelatorio}
            >
              {isGerandoRelatorio ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </Card.Content>
        </Card>

        {/* Gráficos */}
        <View style={styles.graficosContainer}>
          {renderGraficoProgresso()}
          {renderGraficoFinanceiro()}
          {renderGraficoEquipe()}
        </View>

        {/* Relatórios Gerados */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Relatórios Gerados
          </Text>
          
          {filteredRelatorios.map((relatorio) => (
            <Card key={relatorio.id} style={styles.relatorioCard}>
              <Card.Content>
                <View style={styles.relatorioHeader}>
                  <View style={styles.relatorioInfo}>
                    <MaterialCommunityIcons 
                      name={getTipoIcon(relatorio.tipo) as any} 
                      size={24} 
                      color={getTipoColor(relatorio.tipo)} 
                    />
                    <View style={styles.relatorioDetails}>
                      <Text variant="titleMedium" style={styles.relatorioTitulo}>
                        {relatorio.titulo}
                      </Text>
                      <Text variant="bodySmall" style={styles.relatorioPeriodo}>
                        {relatorio.periodo} • Gerado em {relatorio.dataGeracao}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.relatorioActions}>
                    <View style={styles.statusContainer}>
                      <MaterialCommunityIcons 
                        name={getStatusIcon(relatorio.status) as any}
                        size={16}
                        color={getStatusColor(relatorio.status)}
                      />
                      <Text 
                        variant="bodySmall" 
                        style={[styles.statusText, { color: getStatusColor(relatorio.status) }]}
                      >
                        {relatorio.status === 'gerado' ? 'Pronto' : 
                         relatorio.status === 'processando' ? 'Processando' : 'Erro'}
                      </Text>
                    </View>
                    
                    {relatorio.status === 'gerado' && (
                      <IconButton
                        icon="download"
                        size={20}
                        onPress={() => handleExportarRelatorio(relatorio)}
                      />
                    )}
                  </View>
                </View>
                
                <View style={styles.relatorioFooter}>
                  <Chip style={[styles.tipoChip, { backgroundColor: getTipoColor(relatorio.tipo) + '20' }]}>
                    {relatorio.tipo.charAt(0).toUpperCase() + relatorio.tipo.slice(1)}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Modal de Filtros */}
      <Portal>
        <Modal
          visible={showFiltrosModal}
          onDismiss={() => setShowFiltrosModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Filtros de Relatório
          </Text>
          
          <View style={styles.modalForm}>
            <Text variant="bodyMedium" style={styles.filterLabel}>
              Período
            </Text>
            <SegmentedButtons
              value={periodoSelecionado}
              onValueChange={setPeriodoSelecionado}
              buttons={periodos}
              style={styles.segmentedButtons}
            />
            
            <Text variant="bodyMedium" style={styles.filterLabel}>
              Tipo de Relatório
            </Text>
            <SegmentedButtons
              value={tipoRelatorio}
              onValueChange={setTipoRelatorio}
              buttons={tiposRelatorio}
              style={styles.segmentedButtons}
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowFiltrosModal(false)}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowFiltrosModal(false)}
              style={styles.modalButton}
            >
              Aplicar Filtros
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    marginBottom: 12,
    elevation: 2,
  },
  statContent: {
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
    marginBottom: 8,
  },
  statVariacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  variacaoText: {
    fontWeight: '500',
  },
  actionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  actionTitle: {
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  generateButton: {
    marginTop: 8,
  },
  graficosContainer: {
    marginBottom: 24,
  },
  graficoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  graficoTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  graficoContainer: {
    gap: 16,
  },
  progressoItem: {
    marginBottom: 12,
  },
  progressoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressoNome: {
    fontWeight: '500',
    color: '#333',
  },
  progressoPercent: {
    fontWeight: '600',
    color: '#1976d2',
  },
  progressoBar: {
    height: 8,
    borderRadius: 4,
  },
  financeiroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  financeiroItem: {
    alignItems: 'center',
    flex: 1,
  },
  financeiroLabel: {
    color: '#666',
    marginBottom: 4,
  },
  financeiroValor: {
    fontWeight: 'bold',
    color: '#333',
  },
  financeiroProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  financeiroPercent: {
    textAlign: 'center',
    color: '#666',
  },
  equipeContainer: {
    gap: 16,
  },
  equipeItem: {
    marginBottom: 16,
  },
  equipeHeader: {
    marginBottom: 8,
  },
  equipeEspecialidade: {
    fontWeight: '500',
    color: '#333',
  },
  equipeStats: {
    color: '#666',
    marginTop: 2,
  },
  equipeBars: {
    gap: 8,
  },
  equipeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipeBarLabel: {
    minWidth: 60,
    color: '#666',
  },
  equipeBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  equipeBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  relatorioCard: {
    marginBottom: 12,
    elevation: 2,
  },
  relatorioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  relatorioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  relatorioDetails: {
    flex: 1,
  },
  relatorioTitulo: {
    fontWeight: '600',
    color: '#333',
  },
  relatorioPeriodo: {
    color: '#666',
    marginTop: 2,
  },
  relatorioActions: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  statusText: {
    fontWeight: '500',
  },
  relatorioFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tipoChip: {
    backgroundColor: '#e3f2fd',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  modalForm: {
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default RelatoriosScreen;
