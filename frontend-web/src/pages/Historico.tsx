import React, { useState } from 'react';
import { Building2, Calendar, MapPin, Users, Eye, FileText, Download, Filter, Search } from 'lucide-react';

const Historico: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dateFilter, setDateFilter] = useState('todos');

  // Mock data - substituir por dados reais da API
  const obrasHistorico = [
    {
      id: '1',
      nome: 'Estação Faria Lima',
      descricao: 'Reforma e ampliação da estação Faria Lima da Linha 4-Amarela',
      endereco: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '2023-08-10',
      dataFim: '2024-03-15',
      analistas: ['Ana Oliveira', 'Carlos Lima'],
      progresso: 100,
      documentos: 15,
      observacoes: 'Obra concluída dentro do prazo e orçamento previstos.',
    },
    {
      id: '2',
      nome: 'Túnel Rua Augusta',
      descricao: 'Perfuração do túnel sob a Rua Augusta',
      endereco: 'Rua Augusta, 300 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '2023-01-15',
      dataFim: '2023-11-30',
      analistas: ['Roberto Silva', 'Patrícia Costa'],
      progresso: 100,
      documentos: 12,
      observacoes: 'Execução técnica excelente, sem intercorrências.',
    },
    {
      id: '3',
      nome: 'Estação Consolação',
      descricao: 'Manutenção preventiva da estação Consolação',
      endereco: 'Rua da Consolação, 1500 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '2023-05-20',
      dataFim: '2023-08-15',
      analistas: ['Fernando Santos'],
      progresso: 100,
      documentos: 8,
      observacoes: 'Manutenção realizada conforme cronograma.',
    },
    {
      id: '4',
      nome: 'Viaduto do Chá',
      descricao: 'Manutenção estrutural do Viaduto do Chá',
      endereco: 'Viaduto do Chá - São Paulo, SP',
      status: 'Cancelada',
      dataInicio: '2024-03-01',
      dataFim: null,
      analistas: ['Roberto Silva'],
      progresso: 30,
      documentos: 5,
      observacoes: 'Obra cancelada devido a restrições orçamentárias.',
    },
    {
      id: '5',
      nome: 'Estação Paraíso',
      descricao: 'Modernização da estação Paraíso',
      endereco: 'Rua Tutóia, 800 - São Paulo, SP',
      status: 'Concluída',
      dataInicio: '2022-09-01',
      dataFim: '2023-06-30',
      analistas: ['Maria Santos', 'João Silva'],
      progresso: 100,
      documentos: 20,
      observacoes: 'Modernização completa com nova sinalização e acessibilidade.',
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Concluída':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'Cancelada':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'Pausada':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluída':
        return '✓';
      case 'Cancelada':
        return '✗';
      case 'Pausada':
        return '⏸';
      default:
        return '•';
    }
  };

  const filteredObras = obrasHistorico.filter((obra) => {
    const matchesSearch = obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || obra.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'todos') {
      const obraDate = new Date(obra.dataFim || obra.dataInicio);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - obraDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'ultimoMes':
          matchesDate = diffDays <= 30;
          break;
        case 'ultimos3Meses':
          matchesDate = diffDays <= 90;
          break;
        case 'ultimoAno':
          matchesDate = diffDays <= 365;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getDateRange = (dataInicio: string, dataFim: string | null): string => {
    const inicio = new Date(dataInicio);
    const fim = dataFim ? new Date(dataFim) : null;
    
    if (fim) {
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias`;
    }
    return 'Em andamento';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Obras</h1>
        <p className="text-gray-600">
          Visualize o histórico completo de todas as obras do sistema
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
            >
              <option value="todos">Todos os Status</option>
              <option value="Concluída">Concluída</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Pausada">Pausada</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001489] focus:border-[#001489]"
            >
              <option value="todos">Todas as Datas</option>
              <option value="ultimoMes">Último Mês</option>
              <option value="ultimos3Meses">Últimos 3 Meses</option>
              <option value="ultimoAno">Último Ano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#001489]">{obrasHistorico.length}</div>
          <div className="text-sm text-gray-600">Total de Obras</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {obrasHistorico.filter(o => o.status === 'Concluída').length}
          </div>
          <div className="text-sm text-gray-600">Concluídas</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600">
            {obrasHistorico.filter(o => o.status === 'Cancelada').length}
          </div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {obrasHistorico.reduce((acc, obra) => acc + obra.documentos, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Documentos</div>
        </div>
      </div>

      {/* Obras List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Obras do Histórico</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredObras.map((obra) => (
            <div key={obra.id} className="px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{obra.nome}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(obra.status)}`}>
                      {getStatusIcon(obra.status)} {obra.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{obra.descricao}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
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
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{obra.documentos} documentos</span>
                    </div>
                  </div>
                  
                  {obra.observacoes && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Observações:</span> {obra.observacoes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="ml-6 text-right">
                  <div className="text-sm text-gray-600 mb-2">Duração</div>
                  <div className="text-lg font-semibold text-[#001489]">
                    {getDateRange(obra.dataInicio, obra.dataFim)}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button className="flex items-center justify-center w-full px-3 py-2 text-sm text-[#001489] border border-[#001489] rounded-md hover:bg-[#001489] hover:text-white transition-colors cursor-pointer">
                      <Eye className="w-4 h-4 mr-1" />
                      Detalhes
                    </button>
                    <button className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      <Download className="w-4 h-4 mr-1" />
                      Relatório
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default Historico;
