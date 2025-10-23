import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, Download, FileText, Calendar, Building2, Users, DollarSign, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

const HistoricoRelatorio: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);

  // Mock data - substituir por dados reais da API
  const obraHistorico = {
    id: id || '1',
    nome: 'Estação Faria Lima',
    descricao: 'Reforma e ampliação da estação Faria Lima da Linha 4-Amarela',
    endereco: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
    status: 'Concluída',
    dataInicio: '2023-08-10',
    dataFim: '2024-03-15',
    analistas: ['Ana Oliveira', 'Carlos Lima'],
    progresso: 100,
    orcamento: 25000000,
    custoFinal: 24800000,
    economia: 200000,
    documentos: 15,
    fotos: 8,
    observacoes: 'Obra concluída dentro do prazo e orçamento previstos.',
    tipo: 'Reforma e Ampliação',
    responsavel: 'Ana Oliveira',
    dataCriacao: '2023-07-15',
    ultimaAtualizacao: '2024-03-15',
    metricas: {
      prazo: { previsto: 220, real: 217, diferenca: -3 },
      orcamento: { previsto: 25000000, real: 24800000, diferenca: -200000 },
      qualidade: 95,
      satisfacao: 92,
    },
    historico: [
      { data: '2024-03-15', evento: 'Obra concluída e entregue', usuario: 'Ana Oliveira' },
      { data: '2024-03-10', evento: 'Instalação dos sistemas de sinalização', usuario: 'Carlos Lima' },
      { data: '2024-02-28', evento: 'Implementação da acessibilidade', usuario: 'Ana Oliveira' },
      { data: '2024-01-15', evento: 'Início da fase de acabamento', usuario: 'Carlos Lima' },
      { data: '2023-12-01', evento: 'Conclusão da estrutura', usuario: 'Ana Oliveira' },
      { data: '2023-10-15', evento: 'Início da fase estrutural', usuario: 'Carlos Lima' },
      { data: '2023-08-10', evento: 'Início da obra', usuario: 'Ana Oliveira' },
    ],
    riscos: [
      { descricao: 'Atraso na entrega de materiais', status: 'Mitigado', impacto: 'Médio' },
      { descricao: 'Restrições de acesso', status: 'Resolvido', impacto: 'Baixo' },
    ],
    lições: [
      'Implementação de acessibilidade deve ser planejada desde o início',
      'Coordenação com fornecedores é crucial para o cumprimento de prazos',
      'Documentação fotográfica é essencial para o controle de qualidade',
    ],
  };

  const formatos = [
    { id: 'pdf', nome: 'PDF', descricao: 'Documento PDF completo' },
    { id: 'excel', nome: 'Excel', descricao: 'Planilha com dados detalhados' },
    { id: 'csv', nome: 'CSV', descricao: 'Dados estruturados' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 3000));

      const relatorio = {
        obra: obraHistorico,
        formato: selectedFormat,
        opcoes: {
          includePhotos,
          includeDocuments,
          includeMetrics,
        },
        dataGeracao: new Date().toISOString(),
      };

      alert('Relatório gerado com sucesso!');
      console.log('Relatório gerado:', relatorio);
    } catch (error) {
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    navigate('/historico');
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
              <BarChart3 className="w-6 h-6 mr-2" />
              Relatório da Obra
            </h1>
            <p className="text-gray-600">{obraHistorico.nome}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do Relatório */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumo da Obra */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo da Obra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="font-medium text-gray-900">
                      {getDateRange(obraHistorico.dataInicio, obraHistorico.dataFim)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
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
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Economia</p>
                    <p className="font-medium text-green-600">
                      R$ {obraHistorico.economia.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                      {obraHistorico.metricas.prazo.real} dias
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      (Antecipado em {Math.abs(obraHistorico.metricas.prazo.diferenca)} dias)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Orçamento</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-900">
                      R$ {obraHistorico.metricas.orcamento.real.toLocaleString('pt-BR')}
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      (Economia de R$ {Math.abs(obraHistorico.metricas.orcamento.diferenca).toLocaleString('pt-BR')})
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

          {/* Opções do Relatório */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Opções do Relatório</h3>
            <div className="space-y-6">
              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Formato de Saída
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatos.map((formato) => (
                    <button
                      key={formato.id}
                      onClick={() => setSelectedFormat(formato.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedFormat === formato.id
                          ? 'border-[#001489] bg-[#001489]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{formato.nome}</h4>
                          <p className="text-sm text-gray-600">{formato.descricao}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Conteúdo do Relatório
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePhotos}
                      onChange={(e) => setIncludePhotos(e.target.checked)}
                      className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                    />
                    <span className="text-sm text-gray-700">Incluir fotos da obra ({obraHistorico.fotos} fotos)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDocuments}
                      onChange={(e) => setIncludeDocuments(e.target.checked)}
                      className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                    />
                    <span className="text-sm text-gray-700">Incluir documentos ({obraHistorico.documentos} documentos)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMetrics}
                      onChange={(e) => setIncludeMetrics(e.target.checked)}
                      className="rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                    />
                    <span className="text-sm text-gray-700">Incluir métricas de performance</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview do Relatório */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview do Relatório</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Formato:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatos.find(f => f.id === selectedFormat)?.nome}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fotos:</span>
                <span className="text-sm font-medium text-gray-900">
                  {includePhotos ? `${obraHistorico.fotos} fotos` : 'Não incluídas'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Documentos:</span>
                <span className="text-sm font-medium text-gray-900">
                  {includeDocuments ? `${obraHistorico.documentos} documentos` : 'Não incluídos'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Métricas:</span>
                <span className="text-sm font-medium text-gray-900">
                  {includeMetrics ? 'Incluídas' : 'Não incluídas'}
                </span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </div>
                )}
              </button>
              
              <button
                onClick={handleBack}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
              >
                Cancelar
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
                  <span className="text-sm text-gray-700">Relatório Faria Lima - PDF</span>
                </div>
                <button className="text-[#001489] hover:text-[#001489]/80">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Relatório Faria Lima - Excel</span>
                </div>
                <button className="text-[#001489] hover:text-[#001489]/80">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoRelatorio;
