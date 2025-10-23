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

interface NovaObraScreenProps {
  onBack: () => void;
  onObraCriada?: (obra: any) => void;
}

interface FormData {
  nome: string;
  descricao: string;
  localizacao: string;
  tipo: string;
  responsavel: string;
  dataInicio: string;
  dataPrevista: string;
  orcamento: string;
  analistas: string[];
}

const NovaObraScreen: React.FC<NovaObraScreenProps> = ({ onBack, onObraCriada }) => {
  const [formData, setFormData] = React.useState<FormData>({
    nome: '',
    descricao: '',
    localizacao: '',
    tipo: '',
    responsavel: '',
    dataInicio: '',
    dataPrevista: '',
    orcamento: '',
    analistas: []
  });

  const [errors, setErrors] = React.useState<Partial<FormData>>({});
  const [showTipoModal, setShowTipoModal] = React.useState(false);
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

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo da obra é obrigatório';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (!formData.dataPrevista) {
      newErrors.dataPrevista = 'Data prevista é obrigatória';
    }

    if (!formData.orcamento.trim()) {
      newErrors.orcamento = 'Orçamento é obrigatório';
    }

    if (formData.analistas.length === 0) {
      newErrors.analistas = ['Pelo menos um analista deve ser selecionado'];
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

      const novaObra = {
        id: Date.now().toString(),
        nome: formData.nome,
        descricao: formData.descricao,
        localizacao: formData.localizacao,
        tipo: formData.tipo,
        responsavel: formData.responsavel,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataPrevista, // Mapeando para dataFim para compatibilidade
        orcamento: parseFloat(formData.orcamento),
        analistas: formData.analistas.length, // Convertendo array para número
        status: 'Planejada' as const,
        progresso: 0,
        dataCriacao: new Date().toISOString()
      };

      console.log('=== DEBUG: Nova obra criada na tela ===');
      console.log('Nova obra:', JSON.stringify(novaObra, null, 2));

      Alert.alert(
        'Sucesso!', 
        'Obra criada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onObraCriada?.(novaObra);
              onBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar obra. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipoSelect = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipo }));
    setShowTipoModal(false);
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
            Nova Obra
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
              placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
            />
            {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}

            <TextInput
              label="Tipo da Obra *"
              value={formData.tipo}
              editable={false}
              error={!!errors.tipo}
              style={styles.input}
              mode="outlined"
              onPressIn={() => setShowTipoModal(true)}
              pointerEvents="box-only"
            />
            {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}
          </Card.Content>
        </Card>

        {/* Responsável e Datas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Responsável e Cronograma
            </Text>
            
            <TextInput
              label="Responsável *"
              value={formData.responsavel}
              onChangeText={(text) => setFormData(prev => ({ ...prev, responsavel: text }))}
              error={!!errors.responsavel}
              style={styles.input}
              mode="outlined"
            />
            {errors.responsavel && <Text style={styles.errorText}>{errors.responsavel}</Text>}

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
              value={formData.dataPrevista}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dataPrevista: text }))}
              error={!!errors.dataPrevista}
              style={styles.input}
              mode="outlined"
              placeholder="DD/MM/AAAA"
            />
            {errors.dataPrevista && <Text style={styles.errorText}>{errors.dataPrevista}</Text>}
          </Card.Content>
        </Card>

        {/* Orçamento e Analistas */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Orçamento e Equipe
            </Text>
            
            <TextInput
              label="Orçamento *"
              value={formData.orcamento ? formatCurrency(formData.orcamento) : ''}
              onChangeText={handleOrcamentoChange}
              error={!!errors.orcamento}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              placeholder="R$ 0,00"
            />
            {errors.orcamento && <Text style={styles.errorText}>{errors.orcamento}</Text>}

            <TextInput
              label="Analistas Responsáveis *"
              value={formData.analistas.length > 0 ? `${formData.analistas.length} analista(s) selecionado(s)` : ''}
              editable={false}
              error={!!errors.analistas}
              style={styles.input}
              mode="outlined"
              onPressIn={() => setShowAnalistasModal(true)}
              pointerEvents="box-only"
            />
            {errors.analistas && <Text style={styles.errorText}>{errors.analistas[0]}</Text>}

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
            Criar Obra
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

export default NovaObraScreen;
