import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Plus, Search, Filter, Eye, Edit, Trash2, MapPin, Calendar, Users } from 'lucide-react';

const ObrasList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Mock data - substituir por dados reais da API
  const obras = [
    {
      id: '1',
      nome: 'Estação São Paulo-Morumbi',
      descricao: 'Construção da estação São Paulo-Morumbi da Linha 4-Amarela',
      endereco: 'Av. Morumbi, 1000 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '2024-01-15',
      dataFim: '2025-06-30',
      analistas: ['João Silva', 'Maria Santos'],
      progresso: 65,
    },
    {
      id: '2',
      nome: 'Túnel Avenida Paulista',
      descricao: 'Perfuração do túnel sob a Avenida Paulista',
      endereco: 'Av. Paulista, 500 - São Paulo, SP',
      status: 'Em Andamento',
      dataInicio: '2024-02-01',
      dataFim: '2025-12-31',
      analistas: ['Pedro Costa'],
      progresso: 45,
    },
    {
      id: '3',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima',
      endereco: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '2023-08-10',
      dataFim: '2024-03-15',
      analistas: ['Ana Oliveira', 'Carlos Lima'],
      progresso: 100,
    },
    {
      id: '4',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      endereco: 'Viaduto do Chá - São Paulo, SP',
      status: 'Pausada',
      dataInicio: '2024-03-01',
      dataFim: '2024-08-31',
      analistas: ['Roberto Silva'],
      progresso: 30,
    },
  ];

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

  const filteredObras = obras.filter((obra) => {
    const matchesSearch = obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || obra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewObra = (id: string): void => {
    // Navegar para a visualização da obra
    console.log('Visualizar obra:', id);
  };

  const handleEditObra = (id: string): void => {
    // Editar obra (apenas ADMMaster)
    console.log('Editar obra:', id);
  };

  const handleDeleteObra = (id: string): void => {
    // Deletar obra (apenas ADMMaster)
    console.log('Deletar obra:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de Obras</h1>
          <p className="text-gray-600">
            Gerencie todas as obras do sistema
          </p>
        </div>
        {user?.role === 'ADMMaster' && (
          <button className="flex items-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 transition-colors cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Nova Obra
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar obras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
            >
              <option value="todos">Todos os Status</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
              <option value="Pausada">Pausada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Obras Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredObras.map((obra) => (
          <div key={obra.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{obra.nome}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(obra.status)}`}>
                  {obra.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {obra.descricao}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{obra.endereco}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(obra.dataInicio).toLocaleDateString('pt-BR')} - {obra.dataFim ? new Date(obra.dataFim).toLocaleDateString('pt-BR') : 'Em andamento'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{obra.analistas.length} analista(s)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium text-gray-900">{obra.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#001489] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${obra.progresso}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewObra(obra.id)}
                  className="flex items-center text-[#001489] hover:text-[#001489]/80 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Visualizar
                </button>
                
                {user?.role === 'ADMMaster' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditObra(obra.id)}
                      className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteObra(obra.id)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredObras.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma obra encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default ObrasList;
