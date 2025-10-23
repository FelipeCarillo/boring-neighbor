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
  TextInput,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NovoAnalistaScreenProps {
  onBack: () => void;
  onAnalistaCriado?: (analista: any) => void;
}

const NovoAnalistaScreen: React.FC<NovoAnalistaScreenProps> = ({ 
  onBack, 
  onAnalistaCriado 
}) => {
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
  });

  const [errors, setErrors] = React.useState<Partial<typeof formData>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const cargoOptions = [
    'Analista Junior',
    'Analista Pleno',
    'Analista Senior'
  ];

  const statusOptions = [
    'Ativo',
    'Inativo'
  ];

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

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const novoAnalista = {
        id: Date.now().toString(),
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        dataCargo: new Date().toLocaleDateString('pt-BR'),
        status: formData.status,
        obras: [],
        ultimoAcesso: new Date().toLocaleString('pt-BR'),
        dataCriacao: new Date().toISOString()
      };

      Alert.alert(
        'Sucesso!', 
        'Analista criado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onAnalistaCriado?.(novoAnalista);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar analista. Tente novamente.');
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
            Novo Analista
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Pessoais */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações Pessoais
            </Text>
            
            <TextInput
              label="Nome Completo *"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
              error={!!errors.nome}
              style={styles.input}
              mode="outlined"
              placeholder="Ex: João Silva"
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
              autoCapitalize="none"
              placeholder="Ex: joao.silva@metrosp.com.br"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Telefone *"
              value={formData.telefone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, telefone: text }))}
              error={!!errors.telefone}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              placeholder="Ex: (11) 99999-9999"
            />
            {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
          </Card.Content>
        </Card>

        {/* Informações Profissionais */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações Profissionais
            </Text>
            
            <TextInput
              label="Cargo *"
              value={formData.cargo}
              editable={false}
              style={styles.input}
              mode="outlined"
            />
            {errors.cargo && <Text style={styles.errorText}>{errors.cargo}</Text>}

            {/* Seleção de Cargo */}
            <View style={styles.chipsContainer}>
              {cargoOptions.map((cargo) => (
                <Chip
                  key={cargo}
                  selected={formData.cargo === cargo}
                  onPress={() => setFormData(prev => ({ ...prev, cargo }))}
                  style={[
                    styles.cargoChip,
                    formData.cargo === cargo && { backgroundColor: getCargoColor(cargo) + '20' }
                  ]}
                  textStyle={{
                    color: formData.cargo === cargo ? getCargoColor(cargo) : '#666'
                  }}
                >
                  {cargo}
                </Chip>
              ))}
            </View>

            <TextInput
              label="Status *"
              value={formData.status}
              editable={false}
              style={styles.input}
              mode="outlined"
            />

            {/* Seleção de Status */}
            <View style={styles.chipsContainer}>
              {statusOptions.map((status) => (
                <Chip
                  key={status}
                  selected={formData.status === status}
                  onPress={() => setFormData(prev => ({ ...prev, status: status as 'Ativo' | 'Inativo' }))}
                  style={[
                    styles.statusChip,
                    formData.status === status && { backgroundColor: getStatusColor(status) + '20' }
                  ]}
                  textStyle={{
                    color: formData.status === status ? getStatusColor(status) : '#666'
                  }}
                >
                  {status}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Informações do Sistema */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações do Sistema
            </Text>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar-start" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Data de Contratação
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {new Date().toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-plus" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Status Inicial
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {formData.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="file-document-multiple" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Obras Atribuídas
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    0 obra(s) - Será atribuída posteriormente
                  </Text>
                </View>
              </View>
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
            Criar Analista
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
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cargoChip: {
    marginBottom: 8,
  },
  statusChip: {
    marginBottom: 8,
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

export default NovoAnalistaScreen;
