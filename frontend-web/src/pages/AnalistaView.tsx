import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Mail, Phone, Calendar, UserCheck, UserX, ArrowLeft, Edit, Trash2, Shield, Building2, Clock } from 'lucide-react';

const AnalistaView: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const analista = {
    id: id || '1',
    nome: 'João Silva',
    email: 'joao.silva@metrosp.com.br',
    telefone: '(11) 99999-9999',
    role: 'Analista Senior',
    status: 'Ativo',
    dataContratacao: '2020-03-15',
    dataDesligamento: null,
    obrasAtribuidas: [
      { id: '1', nome: 'Estação São Paulo-Morumbi', progresso: 65 },
      { id: '2', nome: 'Estação Faria Lima', progresso: 30 },
    ],
    permissoes: [
      'Visualizar Obras',
      'Editar Documentos',
      'Aprovar Relatórios',
      'Gerenciar Analistas',
    ],
    ultimoAcesso: '2024-01-15 14:30',
    totalObras: 2,
    obrasConcluidas: 0,
    obrasEmAndamento: 2,
    tempoMedioObra: '8 meses',
    especialidades: ['Estruturas', 'Fundações', 'Acabamentos'],
    certificacoes: [
      'Engenharia Civil - USP',
      'PMP - Project Management Professional',
      'ISO 9001 - Auditor Interno',
    ],
    historico: [
      { data: '2024-01-15', evento: 'Atualização de progresso - Estação Morumbi', obra: 'Estação São Paulo-Morumbi' },
      { data: '2024-01-10', evento: 'Início de nova obra', obra: 'Estação Faria Lima' },
      { data: '2023-12-01', evento: 'Conclusão de obra', obra: 'Túnel Avenida Paulista' },
    ],
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Ativo':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'Inativo':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'Pendente':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <UserCheck className="w-4 h-4" />;
      case 'Inativo':
        return <UserX className="w-4 h-4" />;
      case 'Pendente':
        return <Clock className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const handleEdit = () => {
    navigate(`/editar-analista/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este analista?')) {
      alert('Analista excluído com sucesso!');
      navigate('/configuracoes');
    }
  };

  const handleManagePermissions = () => {
    navigate(`/permissoes-analista/${id}`);
  };

  const handleBack = () => {
    navigate('/configuracoes');
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
              {analista.nome}
            </h1>
            <p className="text-gray-600">{analista.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(analista.status)}`}>
            {getStatusIcon(analista.status)}
            <span className="ml-2">{analista.status}</span>
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
                onClick={handleManagePermissions}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Permissões
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
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-[#001489]">{analista.totalObras}</div>
              <div className="text-sm text-gray-600">Total de Obras</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">{analista.obrasConcluidas}</div>
              <div className="text-sm text-gray-600">Obras Concluídas</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{analista.obrasEmAndamento}</div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </div>
          </div>

          {/* Obras Atribuídas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Obras Atribuídas</h3>
            <div className="space-y-4">
              {analista.obrasAtribuidas.map((obra) => (
                <div key={obra.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{obra.nome}</p>
                      <p className="text-sm text-gray-500">Progresso: {obra.progresso}%</p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#001489] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${obra.progresso}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico Recente</h3>
            <div className="space-y-3">
              {analista.historico.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#001489] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.evento}</p>
                    <p className="text-xs text-gray-500">{item.obra} - {item.data}</p>
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
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{analista.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{analista.telefone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Cargo</p>
                  <p className="font-medium text-gray-900">{analista.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Contratado em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(analista.dataContratacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissões */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Permissões</h3>
            <div className="space-y-2">
              {analista.permissoes.map((permissao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{permissao}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Especialidades */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {analista.especialidades.map((especialidade, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {especialidade}
                </span>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certificações</h3>
            <div className="space-y-2">
              {analista.certificacoes.map((certificacao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{certificacao}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalistaView;
