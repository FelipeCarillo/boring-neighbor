import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, MapPin, Calendar, Users, DollarSign, ArrowLeft, Save, X } from 'lucide-react';

const NovaObra: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    tipo: '',
    responsavel: '',
    dataInicio: '',
    dataFim: '',
    orcamento: '',
    analistas: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tiposObra = [
    'Estação de Metrô',
    'Túnel',
    'Viaduto',
    'Ponte',
    'Reforma',
    'Manutenção'
  ];

  const analistasDisponiveis = [
    'João Silva',
    'Maria Santos',
    'Pedro Costa',
    'Ana Oliveira',
    'Carlos Lima'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da obra é obrigatório';
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
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
    if (!formData.dataFim) {
      newErrors.dataFim = 'Data de fim é obrigatória';
    }
    if (!formData.orcamento) {
      newErrors.orcamento = 'Orçamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const novaObra = {
        id: Date.now().toString(),
        ...formData,
        status: 'Planejada',
        progresso: 0,
        dataCriacao: new Date().toISOString(),
      };

      alert('Obra criada com sucesso!');
      console.log('Nova obra criada:', novaObra);
      
      // Reset form
      setFormData({
        nome: '',
        descricao: '',
        endereco: '',
        tipo: '',
        responsavel: '',
        dataInicio: '',
        dataFim: '',
        orcamento: '',
        analistas: [],
      });
    } catch (error) {
      alert('Erro ao criar obra. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalistaToggle = (analista: string) => {
    setFormData(prev => ({
      ...prev,
      analistas: prev.analistas.includes(analista)
        ? prev.analistas.filter(a => a !== analista)
        : [...prev.analistas, analista]
    }));
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-6 h-6 mr-2" />
              Nova Obra
            </h1>
            <p className="text-gray-600">
              Preencha as informações para criar uma nova obra
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-8">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Obra *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.nome ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Estação São Paulo-Morumbi"
                />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.descricao ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Descreva a obra..."
                />
                {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.endereco ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Av. Morumbi, 1000 - São Paulo, SP"
                  />
                </div>
                {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo da Obra *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.tipo ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o tipo</option>
                  {tiposObra.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
              </div>
            </div>
          </div>

          {/* Responsável e Datas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Responsável e Datas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável *
                </label>
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.responsavel ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nome do responsável"
                />
                {errors.responsavel && <p className="text-red-500 text-sm mt-1">{errors.responsavel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.dataInicio ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dataInicio && <p className="text-red-500 text-sm mt-1">{errors.dataInicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.dataFim ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dataFim && <p className="text-red-500 text-sm mt-1">{errors.dataFim}</p>}
              </div>
            </div>
          </div>

          {/* Orçamento e Analistas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Orçamento e Analistas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    value={formData.orcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, orcamento: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.orcamento ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.orcamento && <p className="text-red-500 text-sm mt-1">{errors.orcamento}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analistas Responsáveis
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {analistasDisponiveis.map(analista => (
                    <label key={analista} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.analistas.includes(analista)}
                        onChange={() => handleAnalistaToggle(analista)}
                        className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                      />
                      <span className="text-sm text-gray-700">{analista}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Criar Obra
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovaObra;
