import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mail, Phone, Calendar, ArrowLeft, Save, X } from 'lucide-react';

const EditarAnalista: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const analistaInicial = {
    id: id || '1',
    nome: 'João Silva',
    email: 'joao.silva@metrosp.com.br',
    telefone: '(11) 99999-9999',
    role: 'Analista Senior',
    status: 'Ativo',
    dataContratacao: '2020-03-15',
    especialidades: ['Estruturas', 'Fundações'],
    certificacoes: ['Engenharia Civil - USP', 'PMP - Project Management Professional'],
  };

  const [formData, setFormData] = useState(analistaInicial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    'Analista Junior',
    'Analista Pleno',
    'Analista Senior',
    'Coordenador',
    'Gerente'
  ];

  const statusOptions = [
    'Ativo',
    'Inativo',
    'Pendente'
  ];

  const especialidadesDisponiveis = [
    'Estruturas',
    'Fundações',
    'Acabamentos',
    'Hidráulica',
    'Elétrica',
    'Arquitetura',
    'Segurança',
    'Qualidade'
  ];

  const certificacoesDisponiveis = [
    'Engenharia Civil - USP',
    'Engenharia Civil - UNICAMP',
    'PMP - Project Management Professional',
    'ISO 9001 - Auditor Interno',
    'ISO 14001 - Auditor Interno',
    'OHSAS 18001 - Auditor Interno',
    'LEED Green Associate',
    'PMP - Project Management Professional'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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
    if (!formData.role) {
      newErrors.role = 'Cargo é obrigatório';
    }
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
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

      const analistaAtualizado = {
        ...formData,
        ultimaAtualizacao: new Date().toISOString(),
      };

      alert('Analista atualizado com sucesso!');
      console.log('Analista atualizado:', analistaAtualizado);
      
      navigate(`/analista/${id}`);
    } catch (error) {
      alert('Erro ao atualizar analista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEspecialidadeToggle = (especialidade: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidade)
        ? prev.especialidades.filter(e => e !== especialidade)
        : [...prev.especialidades, especialidade]
    }));
  };

  const handleCertificacaoToggle = (certificacao: string) => {
    setFormData(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.includes(certificacao)
        ? prev.certificacoes.filter(c => c !== certificacao)
        : [...prev.certificacoes, certificacao]
    }));
  };

  const handleBack = () => {
    navigate(`/analista/${id}`);
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
              <Users className="w-6 h-6 mr-2" />
              Editar Analista
            </h1>
            <p className="text-gray-600">
              Modifique as informações do analista
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.nome ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="joao.silva@metrosp.com.br"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                      errors.telefone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Contratação
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.dataContratacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataContratacao: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cargo e Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cargo e Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o cargo</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489] ${
                    errors.status ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {especialidadesDisponiveis.map(especialidade => (
                <label key={especialidade} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.especialidades.includes(especialidade)}
                    onChange={() => handleEspecialidadeToggle(especialidade)}
                    className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                  />
                  <span className="text-sm text-gray-700">{especialidade}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certificações</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
              {certificacoesDisponiveis.map(certificacao => (
                <label key={certificacao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certificacoes.includes(certificacao)}
                    onChange={() => handleCertificacaoToggle(certificacao)}
                    className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                  />
                  <span className="text-sm text-gray-700">{certificacao}</span>
                </label>
              ))}
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
                  Salvar Alterações
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarAnalista;
