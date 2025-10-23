import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Download, FileText, Filter, Building2, Users, ArrowLeft, CheckCircle, X } from 'lucide-react';

const Relatorios: React.FC = () => {
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedFormato, setSelectedFormato] = useState('');
  const [filtros, setFiltros] = useState({
    status: 'todos',
    analista: 'todos',
    obra: 'todos',
  });
  const [showPreview, setShowPreview] = useState(false);

  const tiposRelatorio = [
    {
      id: 'obras',
      nome: 'Relatório de Obras',
      descricao: 'Relatório detalhado de todas as obras',
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 'analistas',
      nome: 'Relatório de Analistas',
      descricao: 'Relatório de performance dos analistas',
      icon: Users,
      color: 'text-green-600 bg-green-100',
    },
    {
      id: 'progresso',
      nome: 'Relatório de Progresso',
      descricao: 'Relatório de progresso das obras',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      id: 'financeiro',
      nome: 'Relatório Financeiro',
      descricao: 'Relatório de custos e orçamentos',
      icon: FileText,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const periodos = [
    { id: 'hoje', nome: 'Hoje' },
    { id: 'semana', nome: 'Esta Semana' },
    { id: 'mes', nome: 'Este Mês' },
    { id: 'trimestre', nome: 'Este Trimestre' },
    { id: 'ano', nome: 'Este Ano' },
    { id: 'personalizado', nome: 'Período Personalizado' },
  ];

  const formatos = [
    { id: 'pdf', nome: 'PDF', descricao: 'Documento PDF' },
    { id: 'excel', nome: 'Excel', descricao: 'Planilha Excel' },
    { id: 'csv', nome: 'CSV', descricao: 'Arquivo CSV' },
  ];

  const statusOptions = [
    'Todos os Status',
    'Em Andamento',
    'Concluída',
    'Pausada',
    'Cancelada',
  ];

  const analistasOptions = [
    'Todos os Analistas',
    'João Silva',
    'Maria Santos',
    'Pedro Costa',
    'Ana Oliveira',
    'Carlos Lima',
  ];

  const obrasOptions = [
    'Todas as Obras',
    'Estação São Paulo-Morumbi',
    'Túnel Avenida Paulista',
    'Estação Faria Lima',
    'Viaduto do Chá',
  ];

  const handleGenerate = () => {
    if (!selectedTipo || !selectedPeriodo || !selectedFormato) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const relatorio = {
      tipo: selectedTipo,
      periodo: selectedPeriodo,
      formato: selectedFormato,
      filtros,
      dataGeracao: new Date().toISOString(),
    };

    console.log('Relatório gerado:', relatorio);
    alert('Relatório gerado com sucesso!');
    setShowPreview(true);
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
              <BarChart3 className="w-6 h-6 mr-2" />
              Relatórios
            </h1>
            <p className="text-gray-600">
              Gere relatórios personalizados do sistema
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do Relatório */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção do Tipo de Relatório */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tipo de Relatório</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiposRelatorio.map((tipo) => {
                const Icon = tipo.icon;
                return (
                  <button
                    key={tipo.id}
                    onClick={() => setSelectedTipo(tipo.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedTipo === tipo.id
                        ? 'border-[#001489] bg-[#001489]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-lg ${tipo.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="ml-3 font-medium text-gray-900">{tipo.nome}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{tipo.descricao}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Período */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Período</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {periodos.map((periodo) => (
                <button
                  key={periodo.id}
                  onClick={() => setSelectedPeriodo(periodo.id)}
                  className={`px-4 py-2 border rounded-md text-sm transition-all ${
                    selectedPeriodo === periodo.id
                      ? 'border-[#001489] bg-[#001489] text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {periodo.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Formato de Saída</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formatos.map((formato) => (
                <button
                  key={formato.id}
                  onClick={() => setSelectedFormato(formato.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedFormato === formato.id
                      ? 'border-[#001489] bg-[#001489]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Download className="w-5 h-5 mr-3 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{formato.nome}</h4>
                      <p className="text-sm text-gray-600">{formato.descricao}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros Avançados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status da Obra
                </label>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489]"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analista
                </label>
                <select
                  value={filtros.analista}
                  onChange={(e) => setFiltros(prev => ({ ...prev, analista: e.target.value }))}
                  className="w-full px-3 py-2 border border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489]"
                >
                  {analistasOptions.map(option => (
                    <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obra Específica
                </label>
                <select
                  value={filtros.obra}
                  onChange={(e) => setFiltros(prev => ({ ...prev, obra: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#001489] focus:border-[#001489]"
                >
                  {obrasOptions.map(option => (
                    <option key={option} value={option.toLowerCase().replace(' ', '-')}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview e Ações */}
        <div className="space-y-6">
          {/* Preview do Relatório */}
          {selectedTipo && selectedPeriodo && selectedFormato && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview do Relatório</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {tiposRelatorio.find(t => t.id === selectedTipo)?.nome}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Período:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {periodos.find(p => p.id === selectedPeriodo)?.nome}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Formato:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatos.find(f => f.id === selectedFormato)?.nome}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-gray-900">{filtros.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Analista:</span>
                  <span className="text-sm font-medium text-gray-900">{filtros.analista}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Obra:</span>
                  <span className="text-sm font-medium text-gray-900">{filtros.obra}</span>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={!selectedTipo || !selectedPeriodo || !selectedFormato}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Gerar Relatório
              </button>
              
              <button
                onClick={() => {
                  setSelectedTipo('');
                  setSelectedPeriodo('');
                  setSelectedFormato('');
                  setFiltros({ status: 'todos', analista: 'todos', obra: 'todos' });
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar Seleção
              </button>
            </div>
          </div>

          {/* Relatórios Recentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios Recentes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Relatório de Obras - Janeiro</span>
                </div>
                <button className="text-[#001489] hover:text-[#001489]/80">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Relatório de Analistas - Dezembro</span>
                </div>
                <button className="text-[#001489] hover:text-[#001489]/80">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Relatório Gerado com Sucesso!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                O relatório foi gerado e está disponível para download.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;
