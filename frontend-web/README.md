# Metrô Obras - Sistema de Gestão de Obras

Sistema de gestão de obras do Metrô de São Paulo desenvolvido com React, TypeScript e Electron.

## 🚀 Funcionalidades

### Autenticação e Usuários
- **Sign In/Sign Up**: Sistema de cadastro e login
- **Verificação**: Verificação de conta por código
- **Controle de Acesso**: Baseado em roles (ADMMaster e Analista)

### Gestão de Obras
- **Dashboard**: Visão geral com estatísticas e obras recentes
- **Lista de Obras**: Visualização e filtros de todas as obras
- **Visualização da Obra**: Detalhes completos com abas organizadas
- **Modelo 3D BIM**: Área preparada para visualização de modelos 3D
- **Histórico**: Histórico completo de obras concluídas/canceladas

### Gestão de Analistas (ADMMaster)
- **CRUD de Analistas**: Criar, editar, visualizar e excluir analistas
- **Atribuição de Obras**: Gerenciar quais analistas trabalham em cada obra
- **Controle de Permissões**: Diferentes níveis de acesso por role

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS v4
- **Desktop**: Electron 30
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Build**: Vite

## 🎨 Paleta de Cores

Seguindo as cores oficiais do Metrô SP:
- **Azul Principal**: `#001489`
- **Branco**: `#fff`
- **Preto**: `#000`
- **Cinza**: Variações de `gray-*`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal com sidebar
│   └── ProtectedRoute.tsx # Rota protegida
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── pages/              # Páginas da aplicação
│   ├── SignIn.tsx      # Login
│   ├── SignUp.tsx      # Cadastro
│   ├── Verify.tsx      # Verificação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── ObrasList.tsx   # Lista de obras
│   ├── ObraView.tsx    # Visualização da obra
│   ├── Historico.tsx   # Histórico de obras
│   └── Configuracoes.tsx # Configurações (ADMMaster)
├── types/              # Tipos TypeScript
│   ├── index.ts        # Tipos principais
│   └── global.d.ts     # Tipos globais
└── App.tsx             # Componente principal com rotas
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para desktop (Electron)
npm run build
```

## 🔐 Roles e Permissões

### ADMMaster
- ✅ Acesso total ao sistema
- ✅ CRUD de obras
- ✅ CRUD de analistas
- ✅ Atribuição de analistas às obras
- ✅ Configurações do sistema

### Analista
- ✅ Visualizar obras atribuídas
- ✅ Acessar documentos das obras
- ✅ Ver histórico de obras
- ❌ Não pode criar/editar obras
- ❌ Não pode gerenciar outros analistas

## 📱 Telas Principais

1. **Sign In** - Login com email e senha
2. **Sign Up** - Cadastro de nova conta
3. **Verify** - Verificação por código
4. **Dashboard** - Visão geral e estatísticas
5. **Lista de Obras** - Todas as obras com filtros
6. **Visualização da Obra** - Detalhes completos com abas
7. **Histórico** - Obras concluídas e canceladas
8. **Configurações** - Gestão de analistas (ADMMaster)

## 🔧 Configuração

### Variáveis de Ambiente
O projeto está configurado para funcionar com dados mockados. Para integração com backend real:

1. Criar arquivo `.env` na raiz
2. Configurar variáveis de API
3. Substituir dados mockados por chamadas reais

### Electron
- Configurado para desenvolvimento e produção
- Suporte a Windows, macOS e Linux
- Build automático com electron-builder

## 📊 Dados Mockados

O sistema inclui dados de exemplo para demonstração:
- Usuários com diferentes roles
- Obras em diferentes status
- Analistas com diferentes níveis
- Documentos e atividades de exemplo

## 🚧 Próximos Passos

- [ ] Integração com backend real
- [ ] Implementação de visualização 3D BIM
- [ ] Sistema de notificações
- [ ] Relatórios e exportação
- [ ] Upload de arquivos
- [ ] Sistema de auditoria

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e desenvolvido para o Metrô de São Paulo.

---

**Desenvolvido com ❤️ para o Metrô de São Paulo**
