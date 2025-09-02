import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Building2, MapPin, Calendar, Users, FileText, Download, Eye, Edit, Trash2, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ObraView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - substituir por dados reais da API
  const obra = {
    id: '1',
    nome: 'Estação São Paulo-Morumbi',
    descricao: 'Construção da estação São Paulo-Morumbi da Linha 4-Amarela do Metrô de São Paulo. Esta estação será um importante hub de integração entre diferentes modais de transporte.',
    endereco: 'Av. Morumbi, 1000 - São Paulo, SP',
    status: 'Em Andamento',
    dataInicio: '2024-01-15',
    dataFim: '2025-06-30',
    analistas: [
      { id: '1', nome: 'João Silva', email: 'joao.silva@metrosp.com.br', role: 'Analista Senior' },
      { id: '2', nome: 'Maria Santos', email: 'maria.santos@metrosp.com.br', role: 'Analista Pleno' }
    ],
    progresso: 65,
    modeloBIM: 'estacao-morumbi-v2.1.rvt',
    documentos: [
      { id: '1', nome: 'Projeto Executivo.pdf', tipo: 'PDF', tamanho: '2.4 MB', dataUpload: '2024-01-20' },
      { id: '2', nome: 'Especificações Técnicas.pdf', tipo: 'PDF', tamanho: '1.8 MB', dataUpload: '2024-01-18' },
      { id: '3', nome: 'Cronograma de Execução.xlsx', tipo: 'Excel', tamanho: '456 KB', dataUpload: '2024-01-15' }
    ],
    atividades: [
      { id: '1', titulo: 'Fundação da estação', status: 'Concluída', dataInicio: '2024-01-15', dataFim: '2024-03-15', responsavel: 'João Silva' },
      { id: '2', titulo: 'Estrutura metálica', status: 'Em Andamento', dataInicio: '2024-03-20', dataFim: '2024-07-20', responsavel: 'Maria Santos' },
      { id: '3', titulo: 'Instalações elétricas', status: 'Pendente', dataInicio: '2024-08-01', dataFim: '2024-10-01', responsavel: 'João Silva' }
    ]
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Em Andamento':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Concluída':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'Pausada':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Cancelada':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'Pendente':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return <Clock className="w-4 h-4" />;
      case 'Concluída':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pausada':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Cancelada':
        return <XCircle className="w-4 h-4" />;
      case 'Pendente':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Eye },
    { id: 'modelo3d', label: 'Modelo 3D', icon: Building2 },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'atividades', label: 'Atividades', icon: Clock },
    { id: 'analistas', label: 'Analistas', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Gerais</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{obra.endereco}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(obra.dataInicio).toLocaleDateString('pt-BR')} - {obra.dataFim ? new Date(obra.dataFim).toLocaleDateString('pt-BR') : 'Em andamento'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{obra.analistas.length} analista(s)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progresso</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#001489] mb-2">{obra.progresso}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-[#001489] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${obra.progresso}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Concluído</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
              <p className="text-gray-600">{obra.descricao}</p>
            </div>
          </div>
        );

      case 'modelo3d':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Modelo 3D BIM</h3>
              <p className="text-gray-600 mb-4">
                Visualização do modelo 3D da obra será carregada aqui.
              </p>
              <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500">
                  Área para renderização do modelo 3D BIM
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Arquivo: {obra.modeloBIM}
                </p>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="flex items-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 transition-colors cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar 3D
                </button>
                <button className="flex items-center px-4 py-2 border border-[#001489] text-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        );

      case 'documentos':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Documentos da Obra</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {obra.documentos.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                      <p className="text-sm text-gray-500">
                        {doc.tipo} • {doc.tamanho} • {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <button className="text-[#001489] hover:text-[#001489]/80 transition-colors cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'atividades':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Atividades da Obra</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {obra.atividades.map((atividade) => (
                <div key={atividade.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{atividade.titulo}</h4>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(atividade.status)}`}>
                          {getStatusIcon(atividade.status)}
                          <span className="ml-1">{atividade.status}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(atividade.dataInicio).toLocaleDateString('pt-BR')} - {new Date(atividade.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Responsável</p>
                      <p className="text-sm font-medium text-gray-900">{atividade.responsavel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analistas':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Analistas da Obra</h3>
              {user?.role === 'ADMMaster' && (
                <button className="px-3 py-1 bg-[#001489] text-white text-sm rounded-md hover:bg-[#001489]/90 transition-colors cursor-pointer">
                  Adicionar Analista
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-200">
              {obra.analistas.map((analista) => (
                <div key={analista.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#001489] rounded-full flex items-center justify-center text-white font-medium">
                      {analista.nome.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{analista.nome}</p>
                      <p className="text-sm text-gray-500">{analista.email}</p>
                      <p className="text-xs text-gray-400">{analista.role}</p>
                    </div>
                  </div>
                  {user?.role === 'ADMMaster' && (
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/obras')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{obra.nome}</h1>
            <p className="text-gray-600">Detalhes e informações da obra</p>
          </div>
        </div>
        
        {user?.role === 'ADMMaster' && (
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 border border-[#001489] text-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Editar Obra
            </button>
            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(obra.status)}`}>
          {getStatusIcon(obra.status)}
          <span className="ml-2">{obra.status}</span>
        </span>
        <div className="text-sm text-gray-500">
          ID: {obra.id}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#001489] text-[#001489]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ObraView;
