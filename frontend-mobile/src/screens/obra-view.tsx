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

interface ObraViewScreenProps {
  obra: {
    id: string;
    nome: string;
    descricao: string;
    localizacao: string;
    dataInicio: string;
    dataFim: string;
    status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
    progresso: number;
    analistas: number;
  };
  onBack: () => void;
  onEdit?: (obra: any) => void;
}

const ObraViewScreen: React.FC<ObraViewScreenProps> = ({ obra, onBack, onEdit }) => {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(obra);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a obra "${obra.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sucesso!', 'Obra excluída com sucesso!');
            onBack();
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
            Detalhes da Obra
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
              Informações Detalhadas
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
                    Data Prevista de Conclusão
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
            </View>
          </Card.Content>
        </Card>

        {/* Progresso */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Progresso da Obra
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text variant="bodyMedium" style={styles.progressLabel}>
                  Progresso Atual
                </Text>
                <Text variant="headlineSmall" style={[styles.progressValue, { color: getStatusColor(obra.status) }]}>
                  {Math.round(obra.progresso * 100)}%
                </Text>
              </View>
              
              <ProgressBar 
                progress={obra.progresso} 
                color={getStatusColor(obra.status)}
                style={styles.progressBar}
              />
              
              <View style={styles.progressStats}>
                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Dias Decorridos
                  </Text>
                  <Text variant="bodyLarge" style={styles.statValue}>
                    45
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Dias Restantes
                  </Text>
                  <Text variant="bodyLarge" style={styles.statValue}>
                    120
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Equipe */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Equipe Responsável
            </Text>
            
            <View style={styles.equipeContainer}>
              {[
                { nome: 'João Silva', especialidade: 'Estruturas', avatar: 'JS' },
                { nome: 'Maria Santos', especialidade: 'Geotecnia', avatar: 'MS' }
              ].map((analista, index) => (
                <View key={index} style={styles.analistaItem}>
                  <Avatar.Text 
                    size={40} 
                    label={analista.avatar}
                    style={styles.analistaAvatar}
                  />
                  <View style={styles.analistaInfo}>
                    <Text variant="bodyMedium" style={styles.analistaNome}>
                      {analista.nome}
                    </Text>
                    <Text variant="bodySmall" style={styles.analistaEspecialidade}>
                      {analista.especialidade}
                    </Text>
                  </View>
                  <Chip style={styles.especialidadeChip}>
                    {analista.especialidade}
                  </Chip>
                </View>
              ))}
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
                onPress={handleEdit}
                style={styles.actionButton}
                icon="pencil"
              >
                Editar Obra
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleDelete}
                style={[styles.actionButton, styles.deleteButton]}
                icon="delete"
                textColor="#f44336"
              >
                Excluir Obra
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
  progressContainer: {
    gap: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#666',
  },
  progressValue: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  progressStats: {
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
  equipeContainer: {
    gap: 12,
  },
  analistaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analistaAvatar: {
    backgroundColor: '#1976d2',
  },
  analistaInfo: {
    flex: 1,
  },
  analistaNome: {
    fontWeight: '500',
    color: '#333',
  },
  analistaEspecialidade: {
    color: '#666',
    marginTop: 2,
  },
  especialidadeChip: {
    backgroundColor: '#e3f2fd',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginTop: 8,
    minHeight: 48, // Área mínima de toque recomendada
    justifyContent: 'center',
  },
  deleteButton: {
    borderColor: '#f44336',
  },
});

export default ObraViewScreen;
