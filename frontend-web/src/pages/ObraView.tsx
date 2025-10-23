import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, Users, DollarSign, ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

const ObraView: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const obra = {
    id: id || '1',
    nome: 'Estação São Paulo-Morumbi',
    descricao: 'Construção da nova estação do metrô na linha 4-amarela, localizada na Avenida Morumbi, próximo ao Shopping Morumbi. A estação terá 3 níveis e capacidade para 50.000 passageiros por dia.',
    endereco: 'Av. Morumbi, 1000 - São Paulo, SP',
    tipo: 'Estação de Metrô',
    responsavel: 'João Silva',
    status: 'Em Andamento',
    progresso: 65,
    dataInicio: '2023-01-15',
    dataFim: '2024-06-30',
    dataPrevista: '2024-06-30',
    orcamento: 15000000,
    analistas: ['João Silva', 'Maria Santos', 'Pedro Costa'],
    faseAtual: 'Estrutura',
    proximaFase: 'Acabamento',
    dataCriacao: '2023-01-10',
    ultimaAtualizacao: '2024-01-15',
    fotos: [
      { id: '1', url: '/api/fotos/1', data: '2024-01-15', descricao: 'Estrutura principal' },
      { id: '2', url: '/api/fotos/2', data: '2024-01-10', descricao: 'Fundação' },
    ],
    documentos: [
      { id: '1', nome: 'Projeto Executivo', tipo: 'PDF', data: '2023-12-01' },
      { id: '2', nome: 'Relatório de Progresso', tipo: 'PDF', data: '2024-01-15' },
    ],
    historico: [
      { data: '2024-01-15', evento: 'Início da fase de estrutura', usuario: 'João Silva' },
      { data: '2024-01-10', evento: 'Conclusão da fundação', usuario: 'Maria Santos' },
      { data: '2023-12-01', evento: 'Aprovação do projeto', usuario: 'Pedro Costa' },
    ],
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
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleEdit = () => {
    navigate(`/editar-obra/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      alert('Obra excluída com sucesso!');
      navigate('/obras');
    }
  };

  const handleBack = () => {
    navigate('/obras');
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
              {obra.nome}
            </h1>
            <p className="text-gray-600">{obra.endereco}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(obra.status)}`}>
            {getStatusIcon(obra.status)}
            <span className="ml-2">{obra.status}</span>
          </span>
          {user?.role === 'ADMMaster' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
            <p className="text-gray-700 leading-relaxed">{obra.descricao}</p>
          </div>

          {/* Progresso */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progresso</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                <span className="text-sm font-medium text-gray-900">{obra.progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#001489] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${obra.progresso}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Fase Atual:</span>
                  <p className="font-medium text-gray-900">{obra.faseAtual}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Próxima Fase:</span>
                  <p className="font-medium text-gray-900">{obra.proximaFase}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos Recentes</h3>
            <div className="grid grid-cols-2 gap-4">
              {obra.fotos.map((foto) => (
                <div key={foto.id} className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{foto.descricao}</p>
                  <p className="text-xs text-gray-500">{foto.data}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico</h3>
            <div className="space-y-3">
              {obra.historico.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#001489] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.evento}</p>
                    <p className="text-xs text-gray-500">{item.data} - {item.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900">{obra.tipo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-medium text-gray-900">{obra.responsavel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Orçamento</p>
                  <p className="font-medium text-gray-900">
                    R$ {obra.orcamento.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Datas</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Início</p>
                  <p className="font-medium text-gray-900">
                    {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Previsão de Fim</p>
                  <p className="font-medium text-gray-900">
                    {new Date(obra.dataPrevista).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analistas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analistas</h3>
            <div className="space-y-3">
              {obra.analistas.map((analista, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#001489] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {analista.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{analista}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos</h3>
            <div className="space-y-3">
              {obra.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                      <p className="text-xs text-gray-500">{doc.tipo} - {doc.data}</p>
                    </div>
                  </div>
                  <button className="text-[#001489] hover:text-[#001489]/80">
                    <Building2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObraView;