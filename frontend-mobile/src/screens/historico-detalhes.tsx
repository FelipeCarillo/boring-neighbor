import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  Card, 
  Button,
  IconButton,
  Chip,
  ProgressBar,
  Avatar,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HistoricoDetalhesScreenProps {
  obra: {
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
    duracao: number;
  };
  onBack: () => void;
  onGerarRelatorio?: (obra: any) => void;
}

const HistoricoDetalhesScreen: React.FC<HistoricoDetalhesScreenProps> = ({ obra, onBack, onGerarRelatorio }) => {
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

  const handleGerarRelatorio = () => {
    Alert.alert(
      'Gerar Relatório',
      `Escolha o formato para o relatório de "${obra.nome}":`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'PDF', 
          onPress: () => {
            Alert.alert('Relatório PDF', 'Relatório em PDF gerado com sucesso!');
            onGerarRelatorio?.(obra);
          }
        },
        { 
          text: 'Excel', 
          onPress: () => {
            Alert.alert('Relatório Excel', 'Relatório em Excel gerado com sucesso!');
            onGerarRelatorio?.(obra);
          }
        },
        { 
          text: 'CSV', 
          onPress: () => {
            Alert.alert('Relatório CSV', 'Relatório em CSV gerado com sucesso!');
            onGerarRelatorio?.(obra);
          }
        }
      ]
    );
  };

  const handleDownloadDocumentos = () => {
    Alert.alert(
      'Download de Documentos',
      `Deseja baixar todos os ${obra.documentos} documentos da obra "${obra.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Baixar', 
          onPress: () => {
            Alert.alert('Download', 'Documentos baixados com sucesso!');
          }
        }
      ]
    );
  };

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
            Detalhes do Histórico
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Principais */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.obraNome}>
                {obra.nome}
              </Text>
              <View style={styles.statusContainer}>
                <MaterialCommunityIcons 
                  name={getStatusIcon(obra.status) as any}
                  size={20}
                  color={getStatusColor(obra.status)}
                />
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(obra.status) + '20' }]}
                  textStyle={{ color: getStatusColor(obra.status) }}
                >
                  {obra.status}
                </Chip>
              </View>
            </View>
            
            <Text variant="bodyLarge" style={styles.descricao}>
              {obra.descricao}
            </Text>
          </Card.Content>
        </Card>

        {/* Informações Detalhadas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações da Obra
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Localização
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {obra.localizacao}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-start" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Data de Início
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {obra.dataInicio}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-end" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Data de Conclusão
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {obra.dataFim}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Analistas Responsáveis
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {obra.analistas} analista(s)
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="file-document" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Documentos Gerados
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {obra.documentos} documentos
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Estatísticas da Obra */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Estatísticas da Obra
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Duração Total
                </Text>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {obra.duracao} dias
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Status Final
                </Text>
                <View style={styles.statusBadge}>
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
            </View>
          </Card.Content>
        </Card>

        {/* Observações */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Observações
            </Text>
            
            <Text variant="bodyMedium" style={styles.observacoesText}>
              {obra.observacoes}
            </Text>
          </Card.Content>
        </Card>

        {/* Documentos */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Documentos da Obra
            </Text>
            
            <View style={styles.documentosContainer}>
              <View style={styles.documentoItem}>
                <MaterialCommunityIcons name="file-document" size={24} color="#2196f3" />
                <View style={styles.documentoInfo}>
                  <Text variant="bodyMedium" style={styles.documentoNome}>
                    Relatório Final
                  </Text>
                  <Text variant="bodySmall" style={styles.documentoData}>
                    {obra.dataFim}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleDownloadDocumentos}>
                  <MaterialCommunityIcons name="download" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.documentoItem}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#4caf50" />
                <View style={styles.documentoInfo}>
                  <Text variant="bodyMedium" style={styles.documentoNome}>
                    Relatório de Progresso
                  </Text>
                  <Text variant="bodySmall" style={styles.documentoData}>
                    {obra.dataFim}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleDownloadDocumentos}>
                  <MaterialCommunityIcons name="download" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.documentoItem}>
                <MaterialCommunityIcons name="currency-usd" size={24} color="#ff9800" />
                <View style={styles.documentoInfo}>
                  <Text variant="bodyMedium" style={styles.documentoNome}>
                    Relatório Financeiro
                  </Text>
                  <Text variant="bodySmall" style={styles.documentoData}>
                    {obra.dataFim}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleDownloadDocumentos}>
                  <MaterialCommunityIcons name="download" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Ações */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Ações
            </Text>
            
            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                onPress={handleGerarRelatorio}
                style={styles.actionButton}
                icon="file-document-plus"
              >
                Gerar Relatório Completo
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleDownloadDocumentos}
                style={styles.actionButton}
                icon="download"
              >
                Baixar Documentos
              </Button>
            </View>
          </Card.Content>
        </Card>
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
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    marginVertical: 8,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 16,
  },
  obraNome: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    backgroundColor: '#e3f2fd',
  },
  descricao: {
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    color: '#333',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontWeight: '500',
  },
  observacoesText: {
    color: '#666',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  documentosContainer: {
    gap: 12,
  },
  documentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  documentoInfo: {
    flex: 1,
  },
  documentoNome: {
    fontWeight: '500',
    color: '#333',
  },
  documentoData: {
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginTop: 8,
    minHeight: 48,
  },
});

export default HistoricoDetalhesScreen;
