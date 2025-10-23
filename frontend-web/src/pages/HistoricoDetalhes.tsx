import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, Users, FileText, ArrowLeft, Download, CheckCircle, XCircle, AlertTriangle, Clock, DollarSign, BarChart3 } from 'lucide-react';

const HistoricoDetalhes: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const obraHistorico = {
    id: id || '1',
    nome: 'Estação Faria Lima',
    descricao: 'Reforma e ampliação da estação Faria Lima da Linha 4-Amarela, incluindo modernização dos sistemas de sinalização, acessibilidade e segurança.',
    endereco: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
    status: 'Concluída',
    dataInicio: '2023-08-10',
    dataFim: '2024-03-15',
    dataPrevista: '2024-03-20',
    analistas: ['Ana Oliveira', 'Carlos Lima'],
    progresso: 100,
    orcamento: 25000000,
    custoFinal: 24800000,
    economia: 200000,
    documentos: 15,
    observacoes: 'Obra concluída dentro do prazo e orçamento previstos. Excelente qualidade de execução.',
    tipo: 'Reforma e Ampliação',
    responsavel: 'Ana Oliveira',
    faseAtual: 'Concluída',
    proximaFase: 'Manutenção',
    dataCriacao: '2023-07-15',
    ultimaAtualizacao: '2024-03-15',
    fotos: [
      { id: '1', url: '/api/fotos/1', data: '2024-03-15', descricao: 'Obra concluída - Vista externa' },
      { id: '2', url: '/api/fotos/2', data: '2024-03-10', descricao: 'Sistemas de sinalização' },
      { id: '3', url: '/api/fotos/3', data: '2024-03-05', descricao: 'Acessibilidade implementada' },
    ],
    documentos: [
      { id: '1', nome: 'Projeto Executivo', tipo: 'PDF', data: '2023-07-15', tamanho: '2.5 MB' },
      { id: '2', nome: 'Relatório de Progresso Final', tipo: 'PDF', data: '2024-03-15', tamanho: '1.8 MB' },
      { id: '3', nome: 'Certificado de Conclusão', tipo: 'PDF', data: '2024-03-15', tamanho: '0.5 MB' },
      { id: '4', nome: 'Fotos da Obra', tipo: 'ZIP', data: '2024-03-15', tamanho: '45.2 MB' },
    ],
    historico: [
      { data: '2024-03-15', evento: 'Obra concluída e entregue', usuario: 'Ana Oliveira', fase: 'Conclusão' },
      { data: '2024-03-10', evento: 'Instalação dos sistemas de sinalização', usuario: 'Carlos Lima', fase: 'Acabamento' },
      { data: '2024-02-28', evento: 'Implementação da acessibilidade', usuario: 'Ana Oliveira', fase: 'Acabamento' },
      { data: '2024-01-15', evento: 'Início da fase de acabamento', usuario: 'Carlos Lima', fase: 'Acabamento' },
      { data: '2023-12-01', evento: 'Conclusão da estrutura', usuario: 'Ana Oliveira', fase: 'Estrutura' },
      { data: '2023-10-15', evento: 'Início da fase estrutural', usuario: 'Carlos Lima', fase: 'Estrutura' },
      { data: '2023-08-10', evento: 'Início da obra', usuario: 'Ana Oliveira', fase: 'Planejamento' },
    ],
    metricas: {
      prazo: { previsto: 220, real: 217, diferenca: -3 },
      orcamento: { previsto: 25000000, real: 24800000, diferenca: -200000 },
      qualidade: 95,
      satisfacao: 92,
    },
    riscos: [
      { id: '1', descricao: 'Atraso na entrega de materiais', status: 'Mitigado', impacto: 'Médio' },
      { id: '2', descricao: 'Restrições de acesso', status: 'Resolvido', impacto: 'Baixo' },
    ],
    lições: [
      'Implementação de acessibilidade deve ser planejada desde o início',
      'Coordenação com fornecedores é crucial para o cumprimento de prazos',
      'Documentação fotográfica é essencial para o controle de qualidade',
    ],
  };

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
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelada':
        return <XCircle className="w-4 h-4" />;
      case 'Pausada':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleBack = () => {
    navigate('/historico');
  };

  const handleDownloadRelatorio = () => {
    alert('Gerando relatório da obra...');
    console.log('Download relatório:', obraHistorico.id);
  };

  const getDateRange = (dataInicio: string, dataFim: string): string => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias`;
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
              {obraHistorico.nome}
            </h1>
            <p className="text-gray-600">{obraHistorico.endereco}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(obraHistorico.status)}`}>
            {getStatusIcon(obraHistorico.status)}
            <span className="ml-2">{obraHistorico.status}</span>
          </span>
          <button
            onClick={handleDownloadRelatorio}
            className="flex items-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição da Obra</h3>
            <p className="text-gray-700 leading-relaxed">{obraHistorico.descricao}</p>
          </div>

          {/* Métricas de Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Prazo</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-900">
                      {obraHistorico.metricas.prazo.real} dias (previsto: {obraHistorico.metricas.prazo.previsto})
                    </span>
                    <span className={`ml-2 text-sm ${obraHistorico.metricas.prazo.diferenca < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obraHistorico.metricas.prazo.diferenca < 0 ? 'Antecipado' : 'Atrasado'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Orçamento</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-900">
                      R$ {obraHistorico.metricas.orcamento.real.toLocaleString('pt-BR')}
                    </span>
                    <span className={`ml-2 text-sm ${obraHistorico.metricas.orcamento.diferenca < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obraHistorico.metricas.orcamento.diferenca < 0 ? 'Economia' : 'Excesso'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Qualidade</span>
                  <span className="text-sm text-gray-900">{obraHistorico.metricas.qualidade}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Satisfação</span>
                  <span className="text-sm text-gray-900">{obraHistorico.metricas.satisfacao}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico Detalhado */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico Detalhado</h3>
            <div className="space-y-4">
              {obraHistorico.historico.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#001489] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{item.evento}</h4>
                      <span className="text-xs text-gray-500">{item.data}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.usuario} • {item.fase}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos da Obra</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {obraHistorico.fotos.map((foto) => (
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

          {/* Lições Aprendidas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lições Aprendidas</h3>
            <div className="space-y-3">
              {obraHistorico.lições.map((licao, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#001489] rounded-full mt-2"></div>
                  <p className="text-sm text-gray-700">{licao}</p>
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
                  <p className="font-medium text-gray-900">{obraHistorico.tipo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-medium text-gray-900">{obraHistorico.responsavel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Orçamento</p>
                  <p className="font-medium text-gray-900">
                    R$ {obraHistorico.orcamento.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Custo Final</p>
                  <p className="font-medium text-gray-900">
                    R$ {obraHistorico.custoFinal.toLocaleString('pt-BR')}
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
                    {new Date(obraHistorico.dataInicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Conclusão</p>
                  <p className="font-medium text-gray-900">
                    {new Date(obraHistorico.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Duração</p>
                  <p className="font-medium text-gray-900">
                    {getDateRange(obraHistorico.dataInicio, obraHistorico.dataFim)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analistas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analistas</h3>
            <div className="space-y-3">
              {obraHistorico.analistas.map((analista, index) => (
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
              {obraHistorico.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                      <p className="text-xs text-gray-500">{doc.tipo} • {doc.tamanho} • {doc.data}</p>
                    </div>
                  </div>
                  <button className="text-[#001489] hover:text-[#001489]/80">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Riscos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Riscos Identificados</h3>
            <div className="space-y-3">
              {obraHistorico.riscos.map((risco) => (
                <div key={risco.id} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-900">{risco.descricao}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Status: {risco.status}</span>
                    <span className="text-xs text-gray-500">Impacto: {risco.impacto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoDetalhes;
