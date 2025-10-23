import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { 
  Text, 
  Card, 
  Button,
  IconButton,
  Switch,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AnalistaPermissoesScreenProps {
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
  onSave?: (permissoes: any) => void;
}

const AnalistaPermissoesScreen: React.FC<AnalistaPermissoesScreenProps> = ({ 
  analista, 
  onBack, 
  onSave 
}) => {
  const [permissoes, setPermissoes] = React.useState({
    // Permissões de Obras
    visualizarObras: true,
    criarObras: false,
    editarObras: false,
    excluirObras: false,
    
    // Permissões de Analistas
    visualizarAnalistas: true,
    criarAnalistas: false,
    editarAnalistas: false,
    excluirAnalistas: false,
    
    // Permissões de Relatórios
    visualizarRelatorios: true,
    gerarRelatorios: false,
    exportarRelatorios: false,
    
    // Permissões de Sistema
    acessarConfiguracoes: false,
    gerenciarPermissoes: false,
    acessarHistorico: true,
    
    // Permissões de Câmera
    tirarFotos: true,
    visualizarFotos: true,
    excluirFotos: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleTogglePermissao = (permissao: keyof typeof permissoes) => {
    setPermissoes(prev => ({
      ...prev,
      [permissao]: !prev[permissao]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Sucesso!', 
        'Permissões atualizadas com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onSave?.(permissoes);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar permissões. Tente novamente.');
    } finally {
      setIsLoading(false);
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

  const renderPermissaoItem = (
    titulo: string,
    descricao: string,
    permissao: keyof typeof permissoes,
    icone: string,
    cor: string
  ) => (
    <View key={permissao} style={styles.permissaoItem}>
      <View style={styles.permissaoInfo}>
        <MaterialCommunityIcons name={icone as any} size={24} color={cor} />
        <View style={styles.permissaoDetails}>
          <Text variant="bodyLarge" style={styles.permissaoTitulo}>
            {titulo}
          </Text>
          <Text variant="bodySmall" style={styles.permissaoDescricao}>
            {descricao}
          </Text>
        </View>
      </View>
      <Switch
        value={permissoes[permissao]}
        onValueChange={() => handleTogglePermissao(permissao)}
        color={cor}
      />
    </View>
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
            Permissões do Analista
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações do Analista */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.analistaInfo}>
              <View style={styles.analistaDetails}>
                <Text variant="titleMedium" style={styles.analistaNome}>
                  {analista.nome}
                </Text>
                <Text variant="bodyMedium" style={styles.analistaEmail}>
                  {analista.email}
                </Text>
                <View style={styles.analistaCargo}>
                  <Chip 
                    style={[styles.cargoChip, { backgroundColor: getCargoColor(analista.cargo) + '20' }]}
                    textStyle={{ color: getCargoColor(analista.cargo) }}
                  >
                    {analista.cargo}
                  </Chip>
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

        {/* Permissões de Obras */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="file-document-multiple" size={20} color="#2196f3" />
              {' '}Permissões de Obras
            </Text>
            
            <View style={styles.permissoesContainer}>
              {renderPermissaoItem(
                'Visualizar Obras',
                'Pode visualizar a lista de obras e detalhes',
                'visualizarObras',
                'eye',
                '#2196f3'
              )}
              
              {renderPermissaoItem(
                'Criar Obras',
                'Pode criar novas obras no sistema',
                'criarObras',
                'plus',
                '#4caf50'
              )}
              
              {renderPermissaoItem(
                'Editar Obras',
                'Pode editar informações das obras',
                'editarObras',
                'pencil',
                '#ff9800'
              )}
              
              {renderPermissaoItem(
                'Excluir Obras',
                'Pode excluir obras do sistema',
                'excluirObras',
                'delete',
                '#f44336'
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Permissões de Analistas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="account-group" size={20} color="#9c27b0" />
              {' '}Permissões de Analistas
            </Text>
            
            <View style={styles.permissoesContainer}>
              {renderPermissaoItem(
                'Visualizar Analistas',
                'Pode visualizar a lista de analistas',
                'visualizarAnalistas',
                'eye',
                '#2196f3'
              )}
              
              {renderPermissaoItem(
                'Criar Analistas',
                'Pode criar novos analistas no sistema',
                'criarAnalistas',
                'plus',
                '#4caf50'
              )}
              
              {renderPermissaoItem(
                'Editar Analistas',
                'Pode editar informações dos analistas',
                'editarAnalistas',
                'pencil',
                '#ff9800'
              )}
              
              {renderPermissaoItem(
                'Excluir Analistas',
                'Pode excluir analistas do sistema',
                'excluirAnalistas',
                'delete',
                '#f44336'
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Permissões de Relatórios */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#4caf50" />
              {' '}Permissões de Relatórios
            </Text>
            
            <View style={styles.permissoesContainer}>
              {renderPermissaoItem(
                'Visualizar Relatórios',
                'Pode visualizar relatórios existentes',
                'visualizarRelatorios',
                'eye',
                '#2196f3'
              )}
              
              {renderPermissaoItem(
                'Gerar Relatórios',
                'Pode gerar novos relatórios',
                'gerarRelatorios',
                'file-document-plus',
                '#4caf50'
              )}
              
              {renderPermissaoItem(
                'Exportar Relatórios',
                'Pode exportar relatórios em diferentes formatos',
                'exportarRelatorios',
                'download',
                '#ff9800'
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Permissões de Sistema */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="cog" size={20} color="#666" />
              {' '}Permissões de Sistema
            </Text>
            
            <View style={styles.permissoesContainer}>
              {renderPermissaoItem(
                'Acessar Configurações',
                'Pode acessar as configurações do sistema',
                'acessarConfiguracoes',
                'cog',
                '#666'
              )}
              
              {renderPermissaoItem(
                'Gerenciar Permissões',
                'Pode gerenciar permissões de outros usuários',
                'gerenciarPermissoes',
                'account-cog',
                '#9c27b0'
              )}
              
              {renderPermissaoItem(
                'Acessar Histórico',
                'Pode visualizar o histórico de obras',
                'acessarHistorico',
                'history',
                '#2196f3'
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Permissões de Câmera */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              <MaterialCommunityIcons name="camera" size={20} color="#ff9800" />
              {' '}Permissões de Câmera
            </Text>
            
            <View style={styles.permissoesContainer}>
              {renderPermissaoItem(
                'Tirar Fotos',
                'Pode tirar fotos das obras',
                'tirarFotos',
                'camera',
                '#ff9800'
              )}
              
              {renderPermissaoItem(
                'Visualizar Fotos',
                'Pode visualizar fotos existentes',
                'visualizarFotos',
                'eye',
                '#2196f3'
              )}
              
              {renderPermissaoItem(
                'Excluir Fotos',
                'Pode excluir fotos do sistema',
                'excluirFotos',
                'delete',
                '#f44336'
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Botões de Ação */}
        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            style={styles.cancelButton}
            loading={isLoading}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            loading={isLoading}
            disabled={isLoading}
          >
            Salvar Permissões
          </Button>
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
  analistaInfo: {
    alignItems: 'center',
  },
  analistaDetails: {
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
    marginBottom: 16,
    textAlign: 'center',
  },
  analistaCargo: {
    flexDirection: 'row',
    gap: 8,
  },
  cargoChip: {
    backgroundColor: '#e3f2fd',
  },
  statusChip: {
    backgroundColor: '#e3f2fd',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissoesContainer: {
    gap: 16,
  },
  permissaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  permissaoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  permissaoDetails: {
    flex: 1,
  },
  permissaoTitulo: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  permissaoDescricao: {
    color: '#666',
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
  },
  saveButton: {
    flex: 1,
    minHeight: 48,
  },
});

export default AnalistaPermissoesScreen;
