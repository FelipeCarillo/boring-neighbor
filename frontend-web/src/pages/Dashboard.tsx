import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - substituir por dados reais da API
  const stats = {
    totalObras: 24,
    obrasEmAndamento: 12,
    obrasConcluidas: 8,
    obrasPausadas: 3,
    obrasCanceladas: 1,
    totalAnalistas: 18,
  };

  const recentObras = [
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      status: 'Em Andamento',
      progresso: 65,
      dataInicio: '2024-01-15',
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      status: 'Em Andamento',
      progresso: 45,
      dataInicio: '2024-02-01',
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      status: 'Concluída',
      progresso: 100,
      dataInicio: '2023-08-10',
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Em Andamento':
        return 'text-blue-600 bg-blue-100';
      case 'Concluída':
        return 'text-green-600 bg-green-100';
      case 'Pausada':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelada':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das suas obras e atividades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-[#001489] rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Obras</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalObras}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-gray-900">{stats.obrasEmAndamento}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.obrasConcluidas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Analistas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnalistas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Obras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Obras Recentes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentObras.map((obra) => (
            <div key={obra.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{obra.nome}</h3>
                  <div className="flex items-center mt-1 space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(obra.status)}`}>
                      {getStatusIcon(obra.status)}
                      <span className="ml-1">{obra.status}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Iniciada em {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {obra.progresso}%
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-[#001489] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${obra.progresso}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'ADMMaster' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-[#001489] text-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
              <Building2 className="w-4 h-4 mr-2" />
              Nova Obra
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-[#001489] text-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Analistas
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-[#001489] text-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
              <Clock className="w-4 h-4 mr-2" />
              Relatórios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
