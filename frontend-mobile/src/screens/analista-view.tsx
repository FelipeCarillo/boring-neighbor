import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  Card, 
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AnalistaViewScreenProps {
  analista: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    dataCargo: string;
    status: 'Ativo' | 'Inativo';
    obras: string[];
    ultimoAcesso: string;
  };
  onBack: () => void;
  onEdit?: (analista: any) => void;
  onPermissoes?: (analista: any) => void;
}

const AnalistaViewScreen: React.FC<AnalistaViewScreenProps> = ({ 
  analista, 
  onBack, 
  onEdit, 
  onPermissoes 
}) => {
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

  const handleEdit = () => {
    onEdit?.(analista);
  };

  const handlePermissoes = () => {
    onPermissoes?.(analista);
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
            Detalhes do Analista
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Principais */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileContainer}>
              <Avatar.Text 
                size={80} 
                label={analista.nome.split(' ').map(n => n[0]).join('')}
                style={[styles.profileAvatar, { backgroundColor: getCargoColor(analista.cargo) }]}
              />
              <View style={styles.profileInfo}>
                <Text variant="headlineMedium" style={styles.analistaNome}>
                  {analista.nome}
                </Text>
                <Text variant="bodyLarge" style={styles.analistaEmail}>
                  {analista.email}
                </Text>
                <Text variant="bodyMedium" style={styles.analistaTelefone}>
                  {analista.telefone}
                </Text>
                <View style={styles.statusContainer}>
                  <MaterialCommunityIcons 
                    name={getStatusIcon(analista.status) as any}
                    size={20}
                    color={getStatusColor(analista.status)}
                  />
                  <Chip 
                    style={[styles.statusChip, { backgroundColor: getStatusColor(analista.status) + '20' }]}
                    textStyle={{ color: getStatusColor(analista.status) }}
                  >
                    {analista.status}
                  </Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Informações Profissionais */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações Profissionais
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="briefcase" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Cargo
                  </Text>
                  <Text variant="bodyMedium" style={[styles.infoValue, { color: getCargoColor(analista.cargo) }]}>
                    {analista.cargo}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-start" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Data de Contratação
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {analista.dataCargo}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Último Acesso
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {analista.ultimoAcesso}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Obras Atribuídas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Obras Atribuídas
            </Text>
            
            <View style={styles.obrasContainer}>
              <Text variant="bodyMedium" style={styles.obrasCount}>
                {analista.obras.length} obra(s) atribuída(s)
              </Text>
              
              {analista.obras.length > 0 ? (
                <View style={styles.obrasList}>
                  {analista.obras.map((obra, index) => (
                    <View key={index} style={styles.obraItem}>
                      <MaterialCommunityIcons name="file-document" size={16} color="#2196f3" />
                      <Text variant="bodyMedium" style={styles.obraNome}>
                        {obra}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyObras}>
                  <MaterialCommunityIcons name="file-document-outline" size={48} color="#ccc" />
                  <Text variant="bodyMedium" style={styles.emptyObrasText}>
                    Nenhuma obra atribuída
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Estatísticas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Estatísticas
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="file-document-multiple" size={24} color="#2196f3" />
                <Text variant="headlineSmall" style={styles.statValue}>
                  {analista.obras.length}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Obras Atribuídas
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color="#4caf50" />
                <Text variant="headlineSmall" style={styles.statValue}>
                  {analista.status === 'Ativo' ? 'Ativo' : 'Inativo'}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Status Atual
                </Text>
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
                onPress={handleEdit}
                style={styles.actionButton}
                icon="pencil"
              >
                Editar Analista
              </Button>
              
              <Button
                mode="outlined"
                onPress={handlePermissoes}
                style={styles.actionButton}
                icon="account-cog"
              >
                Gerenciar Permissões
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  analistaNome: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  analistaEmail: {
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  analistaTelefone: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    backgroundColor: '#e3f2fd',
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
  obrasContainer: {
    gap: 12,
  },
  obrasCount: {
    color: '#2196f3',
    fontWeight: '600',
    textAlign: 'center',
  },
  obrasList: {
    gap: 8,
  },
  obraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  obraNome: {
    flex: 1,
    color: '#333',
  },
  emptyObras: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyObrasText: {
    color: '#666',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginTop: 8,
    minHeight: 48,
  },
});

export default AnalistaViewScreen;
