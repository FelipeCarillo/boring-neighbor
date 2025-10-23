import * as React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  Card, 
  TextInput,
  Button,
  IconButton,
  FAB,
  Portal,
  Modal,
  List,
  Divider,
  Chip,
  Avatar,
  Searchbar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GerenciarAnalistasScreenProps {
  onBack: () => void;
}

interface Analista {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  status: 'Ativo' | 'Inativo';
  obrasAtivas: number;
  dataCadastro: string;
}

const GerenciarAnalistasScreen: React.FC<GerenciarAnalistasScreenProps> = ({ onBack }) => {
  const [analistas, setAnalistas] = React.useState<Analista[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com',
      telefone: '(11) 99999-9999',
      especialidade: 'Estruturas',
      status: 'Ativo',
      obrasAtivas: 3,
      dataCadastro: '15/01/2024'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      telefone: '(11) 88888-8888',
      especialidade: 'Geotecnia',
      status: 'Ativo',
      obrasAtivas: 2,
      dataCadastro: '20/01/2024'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@empresa.com',
      telefone: '(11) 77777-7777',
      especialidade: 'Hidráulica',
      status: 'Inativo',
      obrasAtivas: 0,
      dataCadastro: '10/01/2024'
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      email: 'ana.oliveira@empresa.com',
      telefone: '(11) 66666-6666',
      especialidade: 'Elétrica',
      status: 'Ativo',
      obrasAtivas: 4,
      dataCadastro: '25/01/2024'
    },
    {
      id: '5',
      nome: 'Carlos Ferreira',
      email: 'carlos.ferreira@empresa.com',
      telefone: '(11) 55555-5555',
      especialidade: 'Mecânica',
      status: 'Ativo',
      obrasAtivas: 1,
      dataCadastro: '30/01/2024'
    }
  ]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedAnalista, setSelectedAnalista] = React.useState<Analista | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    status: 'Ativo' as 'Ativo' | 'Inativo'
  });

  const [errors, setErrors] = React.useState<Partial<typeof formData>>({});

  const especialidades = [
    'Estruturas',
    'Geotecnia',
    'Hidráulica',
    'Elétrica',
    'Mecânica',
    'Arquitetura',
    'Segurança',
    'Qualidade',
    'Outros'
  ];

  const filteredAnalistas = analistas.filter(analista =>
    analista.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analista.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analista.especialidade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.especialidade.trim()) {
      newErrors.especialidade = 'Especialidade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAnalista = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const novoAnalista: Analista = {
        id: Date.now().toString(),
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        especialidade: formData.especialidade,
        status: formData.status,
        obrasAtivas: 0,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      };

      setAnalistas(prev => [...prev, novoAnalista]);
      setShowAddModal(false);
      resetForm();
      
      Alert.alert('Sucesso!', 'Analista adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar analista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAnalista = async () => {
    if (!validateForm() || !selectedAnalista) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setAnalistas(prev => prev.map(analista => 
        analista.id === selectedAnalista.id 
          ? { ...analista, ...formData }
          : analista
      ));

      setShowEditModal(false);
      setSelectedAnalista(null);
      resetForm();
      
      Alert.alert('Sucesso!', 'Analista atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar analista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnalista = (analista: Analista) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o analista ${analista.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setAnalistas(prev => prev.filter(a => a.id !== analista.id));
            Alert.alert('Sucesso!', 'Analista excluído com sucesso!');
          }
        }
      ]
    );
  };

  const handleToggleStatus = (analista: Analista) => {
    const newStatus = analista.status === 'Ativo' ? 'Inativo' : 'Ativo';
    setAnalistas(prev => prev.map(a => 
      a.id === analista.id ? { ...a, status: newStatus } : a
    ));
    
    Alert.alert(
      'Status Alterado', 
      `${analista.nome} foi marcado como ${newStatus.toLowerCase()}`
    );
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      especialidade: '',
      status: 'Ativo'
    });
    setErrors({});
  };

  const openEditModal = (analista: Analista) => {
    setSelectedAnalista(analista);
    setFormData({
      nome: analista.nome,
      email: analista.email,
      telefone: analista.telefone,
      especialidade: analista.especialidade,
      status: analista.status
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? '#4caf50' : '#f44336';
  };

  const getStatusIcon = (status: string) => {
    return status === 'Ativo' ? 'check-circle' : 'close-circle';
  };

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
            Gerenciar Analistas
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Search Bar */}
        <Searchbar
          placeholder="Buscar analistas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {analistas.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={[styles.statNumber, { color: '#4caf50' }]}>
                {analistas.filter(a => a.status === 'Ativo').length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Ativos
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={[styles.statNumber, { color: '#f44336' }]}>
                {analistas.filter(a => a.status === 'Inativo').length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Inativos
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Analistas List */}
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredAnalistas.map((analista) => (
            <Card key={analista.id} style={styles.analistaCard}>
              <Card.Content>
                <View style={styles.analistaHeader}>
                  <View style={styles.analistaInfo}>
                    <Avatar.Text 
                      size={40} 
                      label={analista.nome.split(' ').map(n => n[0]).join('')}
                      style={styles.avatar}
                    />
                    <View style={styles.analistaDetails}>
                      <Text variant="titleMedium" style={styles.analistaNome}>
                        {analista.nome}
                      </Text>
                      <Text variant="bodySmall" style={styles.analistaEmail}>
                        {analista.email}
                      </Text>
                      <View style={styles.statusContainer}>
                        <MaterialCommunityIcons 
                          name={getStatusIcon(analista.status) as any}
                          size={16}
                          color={getStatusColor(analista.status)}
                        />
                        <Text 
                          variant="bodySmall" 
                          style={[styles.statusText, { color: getStatusColor(analista.status) }]}
                        >
                          {analista.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.analistaActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => openEditModal(analista)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteAnalista(analista)}
                    />
                  </View>
                </View>
                
                <View style={styles.analistaMeta}>
                  <Chip style={styles.especialidadeChip}>
                    {analista.especialidade}
                  </Chip>
                  <Text variant="bodySmall" style={styles.metaText}>
                    {analista.obrasAtivas} obra(s) ativa(s)
                  </Text>
                </View>
                
                <View style={styles.analistaFooter}>
                  <Text variant="bodySmall" style={styles.footerText}>
                    📞 {analista.telefone}
                  </Text>
                  <Text variant="bodySmall" style={styles.footerText}>
                    📅 Cadastrado em {analista.dataCadastro}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowAddModal(true);
        }}
      />

      {/* Add Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Adicionar Analista
          </Text>
          
          <ScrollView style={styles.modalForm}>
            <TextInput
              label="Nome Completo *"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
              error={!!errors.nome}
              style={styles.input}
              mode="outlined"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              error={!!errors.email}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Telefone *"
              value={formData.telefone}
              onChangeText={handlePhoneChange}
              error={!!errors.telefone}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

            <TextInput
              label="Especialidade *"
              value={formData.especialidade}
              onChangeText={(text) => setFormData(prev => ({ ...prev, especialidade: text }))}
              error={!!errors.especialidade}
              style={styles.input}
              mode="outlined"
            />
            {errors.especialidade && <Text style={styles.errorText}>{errors.especialidade}</Text>}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleAddAnalista}
              style={styles.modalButton}
              loading={isLoading}
              disabled={isLoading}
            >
              Adicionar
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Edit Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => {
            setShowEditModal(false);
            setSelectedAnalista(null);
            resetForm();
          }}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Editar Analista
          </Text>
          
          <ScrollView style={styles.modalForm}>
            <TextInput
              label="Nome Completo *"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
              error={!!errors.nome}
              style={styles.input}
              mode="outlined"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              error={!!errors.email}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Telefone *"
              value={formData.telefone}
              onChangeText={handlePhoneChange}
              error={!!errors.telefone}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

            <TextInput
              label="Especialidade *"
              value={formData.especialidade}
              onChangeText={(text) => setFormData(prev => ({ ...prev, especialidade: text }))}
              error={!!errors.especialidade}
              style={styles.input}
              mode="outlined"
            />
            {errors.especialidade && <Text style={styles.errorText}>{errors.especialidade}</Text>}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setShowEditModal(false);
                setSelectedAnalista(null);
                resetForm();
              }}
              style={styles.modalButton}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleEditAnalista}
              style={styles.modalButton}
              loading={isLoading}
              disabled={isLoading}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
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
  searchBar: {
    marginVertical: 16,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
  },
  analistaCard: {
    marginBottom: 12,
    elevation: 2,
  },
  analistaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  analistaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginRight: 12,
  },
  analistaDetails: {
    flex: 1,
  },
  analistaNome: {
    fontWeight: '600',
    color: '#333',
  },
  analistaEmail: {
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  statusText: {
    fontWeight: '500',
  },
  analistaActions: {
    flexDirection: 'row',
  },
  analistaMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  especialidadeChip: {
    backgroundColor: '#e3f2fd',
  },
  metaText: {
    color: '#666',
  },
  analistaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
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
    maxHeight: 400,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
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

export default GerenciarAnalistasScreen;
