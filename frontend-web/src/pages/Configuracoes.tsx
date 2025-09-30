import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Search, Edit, Trash2, Eye, Shield, UserCheck, UserX, Building2, Mail, Phone, Calendar } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnalista, setEditingAnalista] = useState<any>(null);

  // Mock data - substituir por dados reais da API
  const analistas = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@metrosp.com.br',
      telefone: '(11) 99999-9999',
      role: 'Analista Senior',
      status: 'Ativo',
      dataContratacao: '2020-03-15',
      obrasAtribuidas: ['Estação São Paulo-Morumbi', 'Estação Faria Lima'],
      permissoes: ['Visualizar Obras', 'Editar Documentos', 'Aprovar Relatórios'],
      ultimoAcesso: '2024-01-15 14:30',
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@metrosp.com.br',
      telefone: '(11) 88888-8888',
      role: 'Analista Pleno',
      status: 'Ativo',
      dataContratacao: '2021-08-20',
      obrasAtribuidas: ['Estação São Paulo-Morumbi'],
      permissoes: ['Visualizar Obras', 'Editar Documentos'],
      ultimoAcesso: '2024-01-15 16:45',
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@metrosp.com.br',
      telefone: '(11) 77777-7777',
      role: 'Analista Junior',
      status: 'Ativo',
      dataContratacao: '2023-01-10',
      obrasAtribuidas: ['Túnel Avenida Paulista'],
      permissoes: ['Visualizar Obras'],
      ultimoAcesso: '2024-01-15 10:15',
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      email: 'ana.oliveira@metrosp.com.br',
      telefone: '(11) 66666-6666',
      role: 'Analista Senior',
      status: 'Inativo',
      dataContratacao: '2019-05-12',
      dataDesligamento: '2023-12-01',
      obrasAtribuidas: [],
      permissoes: [],
      ultimoAcesso: '2023-11-30 17:20',
    },
    {
      id: '5',
      nome: 'Carlos Lima',
      email: 'carlos.lima@metrosp.com.br',
      telefone: '(11) 55555-5555',
      role: 'Analista Pleno',
      status: 'Ativo',
      dataContratacao: '2022-03-08',
      obrasAtribuidas: ['Estação Faria Lima'],
      permissoes: ['Visualizar Obras', 'Editar Documentos'],
      ultimoAcesso: '2024-01-15 09:30',
    },
  ];

  const roles = [
    { id: 'Analista Junior', label: 'Analista Junior', permissoes: ['Visualizar Obras'] },
    { id: 'Analista Pleno', label: 'Analista Pleno', permissoes: ['Visualizar Obras', 'Editar Documentos'] },
    { id: 'Analista Senior', label: 'Analista Senior', permissoes: ['Visualizar Obras', 'Editar Documentos', 'Aprovar Relatórios'] },
  ];

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
        return <Calendar className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const filteredAnalistas = analistas.filter((analista) => {
    const matchesSearch = analista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analista.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || analista.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAnalista = (): void => {
    setShowAddModal(true);
    setEditingAnalista(null);
  };

  const handleEditAnalista = (analista: any): void => {
    setEditingAnalista(analista);
    setShowAddModal(true);
  };

  const handleDeleteAnalista = (id: string): void => {
    // Implementar lógica de exclusão
    console.log('Deletar analista:', id);
  };

  const handleViewAnalista = (id: string): void => {
    // Implementar visualização detalhada
    console.log('Visualizar analista:', id);
  };

  // Verificar se o usuário tem permissão de ADMMaster
  if (user?.role !== 'ADMMaster') {
    return (
      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso Negado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações dos Analistas</h1>
          <p className="text-gray-600">
            Gerencie analistas, permissões e configurações do sistema
          </p>
        </div>
        <button
          onClick={handleAddAnalista}
          className="flex items-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Analista
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#001489]">{analistas.length}</div>
          <div className="text-sm text-gray-600">Total de Analistas</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {analistas.filter(a => a.status === 'Ativo').length}
          </div>
          <div className="text-sm text-gray-600">Analistas Ativos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {analistas.filter(a => a.role === 'Analista Senior').length}
          </div>
          <div className="text-sm text-gray-600">Analistas Senior</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {analistas.reduce((acc, a) => acc + a.obrasAtribuidas.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Obras Atribuídas</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar analistas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
            >
              <option value="todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analistas Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Lista de Analistas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Analista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnalistas.map((analista) => (
                <tr key={analista.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#001489] rounded-full flex items-center justify-center text-white font-medium">
                        {analista.nome.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{analista.nome}</div>
                        <div className="text-sm text-gray-500">{analista.email}</div>
                        <div className="text-xs text-gray-400">{analista.telefone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{analista.role}</div>
                    <div className="text-xs text-gray-500">
                      Desde {new Date(analista.dataContratacao).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(analista.status)}`}>
                      {getStatusIcon(analista.status)}
                      <span className="ml-1">{analista.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {analista.obrasAtribuidas.length} obra(s)
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {analista.obrasAtribuidas.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {analista.ultimoAcesso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewAnalista(analista.id)}
                        className="text-[#001489] hover:text-[#001489]/80 transition-colors cursor-pointer"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditAnalista(analista)}
                        className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnalista(analista.id)}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAnalistas.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum analista encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros de busca.
          </p>
        </div>
      )}

      {/* Modal placeholder - implementar modal de adição/edição */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingAnalista ? 'Editar Analista' : 'Novo Analista'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {editingAnalista ? 'Modifique as informações do analista' : 'Preencha as informações do novo analista'}
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 transition-colors cursor-pointer">
                  {editingAnalista ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
