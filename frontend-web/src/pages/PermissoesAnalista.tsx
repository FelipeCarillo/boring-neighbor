import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Save, X, Users, Building2, FileText, BarChart3, Settings } from 'lucide-react';

const PermissoesAnalista: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substituir por dados reais da API
  const analistaInicial = {
    id: id || '1',
    nome: 'João Silva',
    email: 'joao.silva@metrosp.com.br',
    role: 'Analista Senior',
    permissoes: [
      'Visualizar Obras',
      'Editar Documentos',
      'Aprovar Relatórios',
    ],
  };

  const [formData, setFormData] = useState(analistaInicial);
  const [isLoading, setIsLoading] = useState(false);

  const categoriasPermissoes = [
    {
      categoria: 'Obras',
      icon: Building2,
      permissoes: [
        { id: 'visualizar-obras', nome: 'Visualizar Obras', descricao: 'Pode visualizar informações das obras' },
        { id: 'editar-obras', nome: 'Editar Obras', descricao: 'Pode modificar informações das obras' },
        { id: 'criar-obras', nome: 'Criar Obras', descricao: 'Pode criar novas obras' },
        { id: 'excluir-obras', nome: 'Excluir Obras', descricao: 'Pode excluir obras' },
        { id: 'aprovar-obras', nome: 'Aprovar Obras', descricao: 'Pode aprovar obras para execução' },
      ]
    },
    {
      categoria: 'Analistas',
      icon: Users,
      permissoes: [
        { id: 'visualizar-analistas', nome: 'Visualizar Analistas', descricao: 'Pode visualizar informações dos analistas' },
        { id: 'editar-analistas', nome: 'Editar Analistas', descricao: 'Pode modificar informações dos analistas' },
        { id: 'criar-analistas', nome: 'Criar Analistas', descricao: 'Pode criar novos analistas' },
        { id: 'excluir-analistas', nome: 'Excluir Analistas', descricao: 'Pode excluir analistas' },
        { id: 'gerenciar-permissoes', nome: 'Gerenciar Permissões', descricao: 'Pode gerenciar permissões de outros analistas' },
      ]
    },
    {
      categoria: 'Relatórios',
      icon: BarChart3,
      permissoes: [
        { id: 'visualizar-relatorios', nome: 'Visualizar Relatórios', descricao: 'Pode visualizar relatórios gerados' },
        { id: 'gerar-relatorios', nome: 'Gerar Relatórios', descricao: 'Pode gerar novos relatórios' },
        { id: 'exportar-relatorios', nome: 'Exportar Relatórios', descricao: 'Pode exportar relatórios em diferentes formatos' },
        { id: 'aprovar-relatorios', nome: 'Aprovar Relatórios', descricao: 'Pode aprovar relatórios para publicação' },
      ]
    },
    {
      categoria: 'Sistema',
      icon: Settings,
      permissoes: [
        { id: 'configuracoes-sistema', nome: 'Configurações do Sistema', descricao: 'Pode acessar configurações do sistema' },
        { id: 'backup-dados', nome: 'Backup de Dados', descricao: 'Pode realizar backup dos dados' },
        { id: 'logs-sistema', nome: 'Logs do Sistema', descricao: 'Pode visualizar logs do sistema' },
        { id: 'manutencao', nome: 'Manutenção', descricao: 'Pode realizar manutenção do sistema' },
      ]
    },
    {
      categoria: 'Documentos',
      icon: FileText,
      permissoes: [
        { id: 'visualizar-documentos', nome: 'Visualizar Documentos', descricao: 'Pode visualizar documentos das obras' },
        { id: 'editar-documentos', nome: 'Editar Documentos', descricao: 'Pode modificar documentos' },
        { id: 'criar-documentos', nome: 'Criar Documentos', descricao: 'Pode criar novos documentos' },
        { id: 'excluir-documentos', nome: 'Excluir Documentos', descricao: 'Pode excluir documentos' },
        { id: 'aprovar-documentos', nome: 'Aprovar Documentos', descricao: 'Pode aprovar documentos' },
      ]
    },
  ];

  const handlePermissaoToggle = (permissaoId: string) => {
    setFormData(prev => ({
      ...prev,
      permissoes: prev.permissoes.includes(permissaoId)
        ? prev.permissoes.filter(p => p !== permissaoId)
        : [...prev.permissoes, permissaoId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const permissoesAtualizadas = {
        ...formData,
        ultimaAtualizacao: new Date().toISOString(),
      };

      alert('Permissões atualizadas com sucesso!');
      console.log('Permissões atualizadas:', permissoesAtualizadas);
      
      navigate(`/analista/${id}`);
    } catch (error) {
      alert('Erro ao atualizar permissões. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/analista/${id}`);
  };

  const getTotalPermissoes = () => {
    return categoriasPermissoes.reduce((total, categoria) => total + categoria.permissoes.length, 0);
  };

  const getPermissoesAtivas = () => {
    return formData.permissoes.length;
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
              <Shield className="w-6 h-6 mr-2" />
              Gerenciar Permissões
            </h1>
            <p className="text-gray-600">
              {formData.nome} - {formData.role}
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-[#001489]">{getTotalPermissoes()}</div>
          <div className="text-sm text-gray-600">Total de Permissões</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{getPermissoesAtivas()}</div>
          <div className="text-sm text-gray-600">Permissões Ativas</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((getPermissoesAtivas() / getTotalPermissoes()) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Nível de Acesso</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-8">
          {categoriasPermissoes.map((categoria) => {
            const Icon = categoria.icon;
            return (
              <div key={categoria.categoria}>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Icon className="w-5 h-5 mr-2" />
                  {categoria.categoria}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoria.permissoes.map((permissao) => (
                    <div key={permissao.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        id={permissao.id}
                        checked={formData.permissoes.includes(permissao.id)}
                        onChange={() => handlePermissaoToggle(permissao.id)}
                        className="mt-1 rounded border-gray-300 text-[#001489] focus:ring-[#001489]"
                      />
                      <div className="flex-1">
                        <label htmlFor={permissao.id} className="block text-sm font-medium text-gray-900 cursor-pointer">
                          {permissao.nome}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{permissao.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-[#001489] focus:ring-opacity-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Permissões
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PermissoesAnalista;
