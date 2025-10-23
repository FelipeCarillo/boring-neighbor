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
  Chip,
  Portal,
  Modal,
  List,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EditarObraScreenProps {
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
  onObraEditada?: (obra: any) => void;
}

interface FormData {
  nome: string;
  descricao: string;
  localizacao: string;
  tipo: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  orcamento: string;
  analistas: string[];
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Planejada';
  progresso: string;
}

const EditarObraScreen: React.FC<EditarObraScreenProps> = ({ obra, onBack, onObraEditada }) => {
  const [formData, setFormData] = React.useState<FormData>({
    nome: obra.nome,
    descricao: obra.descricao,
    localizacao: obra.localizacao,
    tipo: 'Estação de Metrô', // Valor padrão
    responsavel: 'João Silva', // Valor padrão
    dataInicio: obra.dataInicio,
    dataFim: obra.dataFim,
    orcamento: '1500000', // Valor padrão
    analistas: ['João Silva', 'Maria Santos'], // Valores padrão
    status: obra.status,
    progresso: (obra.progresso * 100).toString()
  });

  const [errors, setErrors] = React.useState<Partial<FormData>>({});
  const [showTipoModal, setShowTipoModal] = React.useState(false);
  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [showAnalistasModal, setShowAnalistasModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const tiposObra = [
    'Estação de Metrô',
    'Túnel',
    'Viaduto',
    'Ponte',
    'Reforma',
    'Ampliação',
    'Manutenção',
    'Outros'
  ];

  const statusOptions = [
    'Em Andamento',
    'Concluída',
    'Pausada',
    'Planejada'
  ];

  const analistasDisponiveis = [
    'João Silva',
    'Maria Santos',
    'Pedro Costa',
    'Ana Oliveira',
    'Carlos Ferreira',
    'Lucia Rodrigues',
    'Roberto Alves',
    'Fernanda Lima'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da obra é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (!formData.dataFim) {
      newErrors.dataFim = 'Data de conclusão é obrigatória';
    }

    if (!formData.progresso) {
      newErrors.progresso = 'Progresso é obrigatório';
    } else if (parseFloat(formData.progresso) < 0 || parseFloat(formData.progresso) > 100) {
      newErrors.progresso = 'Progresso deve estar entre 0 e 100';
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

      const obraEditada = {
        ...obra,
        nome: formData.nome,
        descricao: formData.descricao,
        localizacao: formData.localizacao,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        status: formData.status,
        progresso: parseFloat(formData.progresso) / 100,
        analistas: formData.analistas.length,
        dataEdicao: new Date().toISOString()
      };

      Alert.alert(
        'Sucesso!', 
        'Obra atualizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onObraEditada?.(obraEditada);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar obra. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipoSelect = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipo }));
    setShowTipoModal(false);
  };

  const handleStatusSelect = (status: string) => {
    setFormData(prev => ({ ...prev, status: status as any }));
    setShowStatusModal(false);
  };

  const handleAnalistaToggle = (analista: string) => {
    setFormData(prev => ({
      ...prev,
      analistas: prev.analistas.includes(analista)
        ? prev.analistas.filter(a => a !== analista)
        : [...prev.analistas, analista]
    }));
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(numericValue) / 100);
  };

  const handleOrcamentoChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, orcamento: numericValue }));
  };

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
            Editar Obra
          </Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informações Básicas
            </Text>
            
            <TextInput
              label="Nome da Obra *"
              value={formData.nome}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
              error={!!errors.nome}
              style={styles.input}
              mode="outlined"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

            <TextInput
              label="Descrição *"
              value={formData.descricao}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
              error={!!errors.descricao}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}

            <TextInput
              label="Localização *"
              value={formData.localizacao}
              onChangeText={(text) => setFormData(prev => ({ ...prev, localizacao: text }))}
              error={!!errors.localizacao}
              style={styles.input}
              mode="outlined"
            />
            {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}

            <TextInput
              label="Tipo da Obra"
              value={formData.tipo}
              editable={false}
              style={styles.input}
              mode="outlined"
              onPressIn={() => setShowTipoModal(true)}
              pointerEvents="box-only"
            />
          </Card.Content>
        </Card>

        {/* Status e Progresso */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Status e Progresso
            </Text>
            
            <TextInput
              label="Status da Obra *"
              value={formData.status}
              editable={false}
              style={styles.input}
              mode="outlined"
              onPressIn={() => setShowStatusModal(true)}
              pointerEvents="box-only"
            />

            <TextInput
              label="Progresso (%) *"
              value={formData.progresso}
              onChangeText={(text) => setFormData(prev => ({ ...prev, progresso: text }))}
              error={!!errors.progresso}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="0-100"
            />
            {errors.progresso && <Text style={styles.errorText}>{errors.progresso}</Text>}
          </Card.Content>
        </Card>

        {/* Datas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Cronograma
            </Text>
            
            <TextInput
              label="Data de Início *"
              value={formData.dataInicio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dataInicio: text }))}
              error={!!errors.dataInicio}
              style={styles.input}
              mode="outlined"
              placeholder="DD/MM/AAAA"
            />
            {errors.dataInicio && <Text style={styles.errorText}>{errors.dataInicio}</Text>}

            <TextInput
              label="Data Prevista de Conclusão *"
              value={formData.dataFim}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dataFim: text }))}
              error={!!errors.dataFim}
              style={styles.input}
              mode="outlined"
              placeholder="DD/MM/AAAA"
            />
            {errors.dataFim && <Text style={styles.errorText}>{errors.dataFim}</Text>}
          </Card.Content>
        </Card>

        {/* Orçamento e Equipe */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Orçamento e Equipe
            </Text>
            
            <TextInput
              label="Orçamento"
              value={formData.orcamento ? formatCurrency(formData.orcamento) : ''}
              onChangeText={handleOrcamentoChange}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="R$ 0,00"
            />

            <TextInput
              label="Analistas Responsáveis"
              value={formData.analistas.length > 0 ? `${formData.analistas.length} analista(s) selecionado(s)` : ''}
              editable={false}
              style={styles.input}
              mode="outlined"
              onPressIn={() => setShowAnalistasModal(true)}
              pointerEvents="box-only"
            />

            {formData.analistas.length > 0 && (
              <View style={styles.chipsContainer}>
                {formData.analistas.map((analista, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleAnalistaToggle(analista)}
                    style={styles.chip}
                  >
                    {analista}
                  </Chip>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            style={styles.cancelButton}
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
            Salvar Alterações
          </Button>
        </View>
      </ScrollView>

      {/* Modal de Tipo */}
      <Portal>
        <Modal
          visible={showTipoModal}
          onDismiss={() => setShowTipoModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Selecionar Tipo da Obra
          </Text>
          <ScrollView style={styles.modalList}>
            {tiposObra.map((tipo, index) => (
              <List.Item
                key={index}
                title={tipo}
                onPress={() => handleTipoSelect(tipo)}
                right={() => formData.tipo === tipo ? <List.Icon icon="check" /> : null}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Modal de Status */}
      <Portal>
        <Modal
          visible={showStatusModal}
          onDismiss={() => setShowStatusModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Selecionar Status
          </Text>
          <ScrollView style={styles.modalList}>
            {statusOptions.map((status, index) => (
              <List.Item
                key={index}
                title={status}
                onPress={() => handleStatusSelect(status)}
                right={() => formData.status === status ? <List.Icon icon="check" /> : null}
                left={() => (
                  <MaterialCommunityIcons 
                    name={
                      status === 'Concluída' ? 'check-circle' :
                      status === 'Em Andamento' ? 'clock' :
                      status === 'Pausada' ? 'pause-circle' :
                      'calendar-clock'
                    } 
                    size={24} 
                    color={getStatusColor(status)} 
                  />
                )}
              />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* Modal de Analistas */}
      <Portal>
        <Modal
          visible={showAnalistasModal}
          onDismiss={() => setShowAnalistasModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            Selecionar Analistas
          </Text>
          <ScrollView style={styles.modalList}>
            {analistasDisponiveis.map((analista, index) => (
              <List.Item
                key={index}
                title={analista}
                onPress={() => handleAnalistaToggle(analista)}
                right={() => formData.analistas.includes(analista) ? <List.Icon icon="check" /> : null}
              />
            ))}
          </ScrollView>
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
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#e3f2fd',
  },
  actionsContainer: {
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
  modalList: {
    maxHeight: 300,
  },
});

export default EditarObraScreen;
