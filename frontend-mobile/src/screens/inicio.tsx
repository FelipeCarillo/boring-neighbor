import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { 
  BottomNavigation, 
  Text, 
  Card, 
  ProgressBar, 
  Avatar,
  IconButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Obra {
  id: string;
  nome: string;
  status: 'Em Andamento' | 'Concluída';
  dataInicio: string;
  progresso: number;
}

const HomeRoute = () => {
  const [obras] = React.useState<Obra[]>([
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      status: 'Em Andamento',
      dataInicio: '14/01/2024',
      progresso: 0.65
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      status: 'Em Andamento',
      dataInicio: '31/01/2024',
      progresso: 0.45
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      status: 'Concluída',
      dataInicio: '09/08/2023',
      progresso: 1.0
    }
  ]);

  const estatisticas = [
    { titulo: 'Total de Obras', valor: '24', icone: 'file-document-multiple', cor: '#1976d2' },
    { titulo: 'Em Andamento', valor: '12', icone: 'clock', cor: '#1976d2' },
    { titulo: 'Concluídas', valor: '8', icone: 'check-circle', cor: '#4caf50' },
    { titulo: 'Analistas', valor: '18', icone: 'account-group', cor: '#1976d2' }
  ];

  const acoesRapidas = [
    { titulo: 'Nova Obra', icone: 'file-document-plus' },
    { titulo: 'Gerenciar Analistas', icone: 'account-group' },
    { titulo: 'Relatórios', icone: 'chart-line' }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Concluída' ? '#4caf50' : '#1976d2';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Concluída' ? 'check-circle' : 'clock';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Dashboard
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
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            Bem-vindo, Administrador!
          </Text>
          <Text variant="bodyMedium" style={styles.welcomeSubtitle}>
            Aqui está um resumo das suas obras e atividades
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          {estatisticas.map((stat, index) => (
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
          ))}
        </View>

        {/* Recent Works Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Obras Recentes
          </Text>
          <View style={styles.obrasList}>
            {obras.map((obra) => (
              <Card key={obra.id} style={styles.obraCard}>
                <Card.Content>
                  <View style={styles.obraHeader}>
                    <Text variant="titleMedium" style={styles.obraNome}>
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
                  
                  <Text variant="bodySmall" style={styles.obraData}>
                    Iniciada em {obra.dataInicio}
                  </Text>
                  
                  <View style={styles.progressContainer}>
                    <ProgressBar 
                      progress={obra.progresso} 
                      color={getStatusColor(obra.status)}
                      style={styles.progressBar}
                    />
                    <Text variant="bodySmall" style={styles.progressText}>
                      {Math.round(obra.progresso * 100)}%
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Ações Rápidas
          </Text>
          <View style={styles.actionsContainer}>
            {acoesRapidas.map((acao, index) => (
              <TouchableOpacity key={index} style={styles.actionButton}>
                <MaterialCommunityIcons 
                  name={acao.icone as any} 
                  size={24} 
                  color="#1976d2" 
                />
                <Text variant="bodyMedium" style={styles.actionText}>
                  {acao.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ObraRoute = () => <Text>Lista de Obras</Text>;
const CameraRoute = () => <Text>Camera</Text>;
const HistoricoRoute = () => <Text>Histórico</Text>;
const ConfigRoute = () => <Text>Configurações</Text>;

export default function App() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'home', title: 'Dashboard', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'obras', title: 'Lista de Obras', focusedIcon: 'hammer', unfocusedIcon: 'hammer-screwdriver' },
    { key: 'camera', title: 'Câmera', focusedIcon: 'camera', unfocusedIcon: 'camera-outline' },
    { key: 'historico', title: 'Histórico', focusedIcon: 'history' },
    { key: 'configuracoes', title: 'Configurações', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    obras: ObraRoute,
    camera: CameraRoute,
    historico: HistoricoRoute,
    configuracoes: ConfigRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#1976d2',
  },
  userDetails: {
    marginLeft: 8,
    marginRight: 8,
  },
  userName: {
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    color: '#666',
  },
  logoutButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtitle: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  obrasList: {
    gap: 12,
  },
  obraCard: {
    elevation: 2,
  },
  obraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  obraNome: {
    flex: 1,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontWeight: '500',
  },
  obraData: {
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontWeight: '600',
    color: '#1976d2',
    minWidth: 40,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976d2',
    gap: 12,
  },
  actionText: {
    color: '#1976d2',
    fontWeight: '500',
  },
});