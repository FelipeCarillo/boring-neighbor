# 🚇 Boring Neighbor - Sistema de Gestão de Construções Metrô SP

Sistema completo de gestão de construções para o Metrô de São Paulo com análise de desvios BIM, rastreamento de progresso e geração de relatórios com Inteligência Artificial.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Autenticação e Roles](#autenticação-e-roles)
- [API Endpoints](#api-endpoints)
- [Análise de Desvios BIM](#análise-de-desvios-bim)
- [Geração de Relatórios com IA](#geração-de-relatórios-com-ia)
- [Deploy](#deploy)
- [Desenvolvimento](#desenvolvimento)
- [Contribuindo](#contribuindo)

## 🎯 Visão Geral

O **Boring Neighbor** é uma plataforma completa para gerenciamento de obras do Metrô de São Paulo que permite:

- **Gestão de Obras**: Criação e gerenciamento de projetos de construção
- **Rastreamento de Progresso**: Registro de progresso com fotos em tempo real
- **Análise BIM**: Comparação automática entre referências BIM e fotos reais usando SSIM
- **Relatórios Inteligentes**: Geração automática de relatórios com análise de IA
- **Gestão de Usuários**: Sistema de roles e permissões (ADMIN, SUPERVISOR, OPERADOR)
- **Visualização 3D**: Visualização de modelos BIM/IFC (em desenvolvimento)

## 🏗️ Arquitetura

A aplicação é composta por 4 módulos principais:

```
boring-neighbor/
├── backend/              # API REST (FastAPI + Python)
├── frontend-web/         # Interface Web (React + Material-UI)
├── frontend-mobile2/     # App Mobile (React Native + Expo)
├── deploy/               # Configurações Docker
└── iac/                  # Infrastructure as Code (AWS CDK)
```

### Fluxo de Dados

```
Mobile App / Web App
        ↓
    Backend API (FastAPI)
        ↓
    ┌───┴───┐
    ↓       ↓
PostgreSQL  MinIO/S3
(Database)  (Storage)
```

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM
- **Alembic** - Migrações de banco de dados
- **JWT** - Autenticação baseada em tokens
- **OpenCV** - Processamento de imagens
- **scikit-image** - Análise SSIM para desvios BIM
- **OpenAI API** - Geração de relatórios com IA
- **Boto3** - Integração com AWS S3/MinIO
- **LangChain** - Framework para IA

### Frontend Web
- **React 18** - Biblioteca JavaScript
- **Material-UI (MUI)** - Componentes de interface
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Three.js** - Visualização 3D (BIM/IFC)
- **jsPDF** - Geração de PDFs

### Frontend Mobile
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Roteamento baseado em arquivos
- **Expo Camera** - Captura de fotos
- **AsyncStorage** - Armazenamento local

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **AWS CDK** - Infrastructure as Code
- **MinIO** - Object Storage (S3-compatible)

## 📦 Pré-requisitos

### Desenvolvimento Local

- **Python** 3.12+
- **Node.js** 18+ e npm
- **Docker** e Docker Compose
- **Git**

### Mobile Development

- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app (iOS/Android) para desenvolvimento
- **Xcode** (macOS) para builds iOS
- **Android Studio** para builds Android

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd boring-neighbor
```

### 2. Backend

```bash
cd backend
pip install -e .
```

### 3. Frontend Web

```bash
cd frontend-web
npm install
```

### 4. Frontend Mobile

```bash
cd frontend-mobile2
npm install
```

## ⚙️ Configuração

### Backend

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cd backend
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=postgresql://admin:secret@localhost:5432/boring_neighbor

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:8081"]

# S3/MinIO
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=minio
S3_SECRET_ACCESS_KEY=minio123
S3_BUCKET_NAME=metro-sp-constructions
S3_REGION=us-east-1

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Redis (opcional)
REDIS_URL=redis://localhost:6379
```

### Frontend Web

Configure a URL da API em `frontend-web/src/api/client.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Frontend Mobile

Configure a URL da API em `frontend-mobile2/src/constants/index.ts`:

```typescript
export const API_BASE_URL = 'http://192.168.56.1:8000/api';
```

> **Nota**: No mobile, use o IP da sua máquina local (não `localhost`) para acessar a API do backend.

## ▶️ Executando a Aplicação

### 1. Iniciar Infraestrutura (PostgreSQL + MinIO)

```bash
cd deploy/infra
docker-compose up -d
```

Isso iniciará:
- **PostgreSQL** na porta `5432`
- **MinIO** nas portas `9000` (API) e `9001` (Console)

Acesse o console MinIO em: `http://localhost:9001`
- Usuário: `minio`
- Senha: `minio123`

### 2. Inicializar Banco de Dados

```bash
cd backend
chmod +x scripts/init_db.sh
./scripts/init_db.sh
```

Ou no Windows:

```bash
cd backend
alembic upgrade head
python scripts/create_admin.py
```

### 3. Executar Backend

```bash
cd backend
python run.py
```

A API estará disponível em:
- **API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 4. Executar Frontend Web

```bash
cd frontend-web
npm start
```

A aplicação web estará disponível em: `http://localhost:3000`

### 5. Executar Frontend Mobile

```bash
cd frontend-mobile2
npm start
```

Escaneie o QR code com o app **Expo Go** ou pressione:
- `a` para Android
- `i` para iOS
- `w` para web

## 📁 Estrutura do Projeto

```
boring-neighbor/
├── backend/
│   ├── src/
│   │   ├── configs/          # Configurações
│   │   ├── entities/          # Entidades Pydantic
│   │   ├── helpers/           # Utilitários (auth, errors, enums)
│   │   ├── infra/             # Infraestrutura (S3, etc)
│   │   ├── repositories/      # Repositórios e Models SQLAlchemy
│   │   ├── router/            # Rotas da API
│   │   │   ├── auth/          # Autenticação
│   │   │   ├── users/         # Usuários
│   │   │   ├── constructions/ # Obras
│   │   │   ├── progress/      # Progresso
│   │   │   └── reports/       # Relatórios
│   │   └── services/          # Serviços (deviation_calculator, openai_service)
│   ├── alembic/               # Migrações
│   ├── scripts/               # Scripts utilitários
│   └── run.py                 # Entry point
│
├── frontend-web/
│   ├── src/
│   │   ├── api/               # Clientes API
│   │   ├── components/        # Componentes React
│   │   │   ├── Auth/          # Autenticação
│   │   │   ├── BIM/           # Visualização BIM
│   │   │   ├── Charts/        # Gráficos
│   │   │   ├── Common/        # Componentes comuns
│   │   │   ├── Constructions/ # Obras
│   │   │   ├── Layout/        # Layout
│   │   │   ├── Progress/      # Progresso
│   │   │   └── Reports/       # Relatórios
│   │   ├── contexts/          # Contextos React
│   │   ├── pages/             # Páginas
│   │   ├── theme/             # Tema Material-UI
│   │   └── utils/             # Utilitários
│   └── public/                # Arquivos estáticos
│
├── frontend-mobile2/
│   ├── app/                   # Rotas (Expo Router)
│   │   ├── (tabs)/            # Tabs principais
│   │   └── construction/      # Detalhes de obra
│   ├── src/
│   │   ├── api/               # Clientes API
│   │   ├── components/        # Componentes React Native
│   │   ├── contexts/          # Contextos React
│   │   ├── constants/         # Constantes
│   │   └── types/             # TypeScript types
│   └── assets/                # Imagens e recursos
│
├── deploy/
│   ├── backend/               # Dockerfile backend
│   ├── frontend/              # Dockerfile frontend
│   └── infra/                # Docker Compose
│
└── iac/                       # Infrastructure as Code (AWS CDK)
```

## ✨ Funcionalidades

### Gestão de Obras
- Criação e edição de projetos de construção
- Definição de fases padrão (Fundação, Estrutura, Alvenaria, etc.)
- Atribuição de usuários às obras
- Upload de referências BIM por fase
- Status de obras (Planejada, Em Andamento, Concluída, etc.)

### Rastreamento de Progresso
- Registro de progresso com fotos
- Associação a fases específicas
- Notas e observações
- Histórico completo de progresso

### Análise de Desvios BIM
- Comparação automática entre referências BIM e fotos reais
- Cálculo de desvio usando SSIM (Structural Similarity Index)
- Score de conformidade (0-100)
- Identificação de desvios críticos (score < 70)

### Relatórios com IA
- Geração automática de relatórios com OpenAI
- Resumo executivo
- Análise de desvios críticos
- Análise por fase
- Recomendações e ações corretivas
- Identificação de riscos

### Gestão de Usuários
- Sistema de roles (ADMIN, SUPERVISOR, OPERADOR)
- CRUD completo de usuários
- Atribuição de usuários às obras
- Perfis de usuário

## 🔐 Autenticação e Roles

### Sistema de Autenticação

A aplicação utiliza **JWT (JSON Web Tokens)** para autenticação:

1. Login com `registro` (ID do funcionário) e `password`
2. Recebimento de `access_token` e `refresh_token`
3. Uso do `access_token` em requisições subsequentes
4. Refresh do token quando expirado

### Roles e Permissões

#### 👑 ADMIN
- Acesso total ao sistema
- Gestão completa de usuários (CRUD)
- Gestão completa de obras (CRUD)
- Todas as operações de SUPERVISOR e OPERADOR

#### 👨‍💼 SUPERVISOR
- Criar e editar obras
- Atribuir usuários às obras
- Upload de referências BIM
- Gerar relatórios
- Criar usuários (OPERADOR/SUPERVISOR)
- Visualizar todas as obras

#### 👷 OPERADOR
- Visualizar obras atribuídas
- Registrar progresso com fotos
- Visualizar relatórios e desvios
- Visualizar próprio perfil

### Usuário Admin Padrão

Ao inicializar o banco de dados, um usuário admin é criado:

- **Registro**: `0000001`
- **Senha**: `admin123`
- **Email**: `admin@metrosp.com.br`
- **Role**: `ADMIN`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 📡 API Endpoints

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login com registro + senha | Não |
| POST | `/api/auth/refresh` | Atualizar access token | Não |
| GET | `/api/auth/me` | Obter informações do usuário atual | Sim |

### Usuários (`/api/users`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/users/` | Criar usuário | ADMIN/SUPERVISOR |
| GET | `/api/users/` | Listar usuários | ADMIN/SUPERVISOR |
| GET | `/api/users/{id}` | Obter usuário | Autenticado |
| PUT | `/api/users/{id}` | Atualizar usuário | ADMIN |
| DELETE | `/api/users/{id}` | Deletar usuário | ADMIN |

### Obras (`/api/constructions`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/constructions/` | Criar obra | ADMIN/SUPERVISOR |
| GET | `/api/constructions/` | Listar obras | Autenticado |
| GET | `/api/constructions/{id}` | Obter detalhes da obra | Autenticado |
| PUT | `/api/constructions/{id}` | Atualizar obra | ADMIN/SUPERVISOR |
| DELETE | `/api/constructions/{id}` | Deletar obra | ADMIN |
| POST | `/api/constructions/{id}/users` | Atribuir usuários | ADMIN/SUPERVISOR |
| DELETE | `/api/constructions/{id}/users/{user_id}` | Remover usuário | ADMIN/SUPERVISOR |
| POST | `/api/constructions/{id}/bim` | Upload referência BIM | ADMIN/SUPERVISOR |

### Progresso (`/api/progress`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/progress/` | Registrar progresso com foto | Autenticado |
| GET | `/api/progress/{id}` | Obter entrada de progresso | Autenticado |
| GET | `/api/progress/construction/{id}` | Listar progresso por obra | Autenticado |

### Relatórios (`/api/reports`)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/reports/construction/{id}` | Gerar relatório com IA | ADMIN/SUPERVISOR |
| GET | `/api/reports/{id}` | Obter relatório | Autenticado |
| GET | `/api/reports/construction/{id}` | Listar relatórios | Autenticado |

## 🔍 Análise de Desvios BIM

O sistema utiliza **SSIM (Structural Similarity Index)** para calcular desvios entre referências BIM e fotos reais.

### Processo de Análise

1. **Conversão para escala de cinza**
2. **Equalização de histograma**
3. **Redimensionamento das imagens**
4. **Cálculo SSIM**
5. **Normalização do score (0-100)**

### Interpretação do Score

- **Score 100**: Correspondência perfeita
- **Score 70-100**: Boa conformidade
- **Score < 70**: Desvio crítico (sinalizado nos relatórios)

### Exemplo de Workflow

1. **Upload de Referência BIM**
   ```bash
   POST /api/constructions/{id}/bim
   Form Data:
     - file: [BIM_IMAGE.jpg]
     - phase_id: {phase_id}
     - description: "Planta estrutura pilar A"
   ```

2. **Registro de Progresso**
   ```bash
   POST /api/progress/
   Form Data:
     - construction_id: {construction_id}
     - phase_id: {phase_id}
     - file: [PROGRESS_PHOTO.jpg]
     - notes: "Estrutura concluída 70%"
   ```

3. **Análise Automática**
   - O sistema compara automaticamente a foto com a referência BIM
   - Calcula o score de desvio
   - Armazena o resultado no banco de dados

## 🤖 Geração de Relatórios com IA

Os relatórios são gerados automaticamente usando a **OpenAI API** e incluem:

### Conteúdo dos Relatórios

1. **Resumo Executivo**
   - Status geral da construção
   - Progresso por fase
   - Principais métricas

2. **Análise de Desvios**
   - Desvios críticos identificados (score < 70)
   - Comparação visual
   - Impacto no projeto

3. **Análise por Fase**
   - Progresso detalhado por fase
   - Conformidade com referências BIM
   - Status de cada fase

4. **Recomendações**
   - Ações corretivas sugeridas
   - Priorização de intervenções
   - Melhores práticas

5. **Riscos**
   - Riscos técnicos identificados
   - Riscos de cronograma
   - Mitigações sugeridas

### Gerar Relatório

```bash
POST /api/reports/construction/{id}
```

O sistema:
1. Coleta todas as entradas de progresso
2. Analisa desvios BIM
3. Gera relatório com OpenAI
4. Armazena no banco de dados
5. Retorna o relatório completo

## 🚢 Deploy

### Deploy Local com Docker

```bash
cd deploy/infra
docker-compose up -d
```

### Deploy em Produção

1. **Backend**
   - Configure variáveis de ambiente
   - Use chave JWT forte
   - Configure CORS adequadamente
   - Use banco de dados de produção
   - Configure SSL/TLS
   - Configure chave OpenAI API
   - Configure S3/MinIO com credenciais adequadas

2. **Frontend Web**
   ```bash
   cd frontend-web
   npm run build
   # Servir arquivos estáticos com nginx/apache
   ```

3. **Frontend Mobile**
   ```bash
   cd frontend-mobile2
   # Build para Android
   npx expo build:android
   # Build para iOS
   npx expo build:ios
   ```

### Infrastructure as Code (AWS CDK)

O projeto inclui configuração de IaC usando AWS CDK:

```bash
cd iac
pip install -r requirements.txt
cdk synth
cdk deploy
```

## 💻 Desenvolvimento

### Migrações de Banco de Dados

```bash
cd backend
# Criar nova migração
alembic revision --autogenerate -m "Descrição da migração"

# Aplicar migrações
alembic upgrade head

# Reverter migração
alembic downgrade -1
```

### Criar Novo Usuário

```bash
cd backend
python scripts/create_admin.py
```

### Executar Testes

```bash
cd backend
pytest tests/
```

### Estrutura de Armazenamento S3

```
metro-sp-constructions/
├── constructions/
│   └── {construction_id}/
│       ├── bim/
│       │   └── {uuid}_{filename}.jpg
│       └── progress/
│           └── {uuid}_{filename}.jpg
```

### Fases Padrão

Cada obra criada automaticamente recebe 6 fases padrão:

1. **Fundação** (Foundation)
2. **Estrutura** (Structure)
3. **Alvenaria** (Masonry)
4. **Instalações** (Installations)
5. **Acabamento** (Finishing)
6. **Finalização** (Finalization)

## 🎨 Tema e Cores

A aplicação utiliza as cores oficiais do Metrô de São Paulo:

- **Primary**: `#0455BF` (Linha 1 - Azul)
- **Secondary**: `#EE3124` (Linha 3 - Vermelho)
- **Success**: `#00903E` (Linha 2 - Verde)
- **Warning**: `#FBD12D` (Linha 4 - Amarelo)
- **Background**: `#FAFAFA`
- **Surface**: `#FFFFFF`

## 📱 Permissões Mobile

O app mobile requer as seguintes permissões:

- **Câmera**: Para tirar fotos das obras
- **Galeria**: Para selecionar fotos da galeria
- **Armazenamento**: Para salvar fotos temporariamente

Essas permissões são solicitadas automaticamente quando necessário.

## 🐛 Tratamento de Erros

Todos os erros retornam formato consistente:

```json
{
  "detail": "Mensagem de erro descritiva"
}
```

### Códigos de Status HTTP

- `400`: Bad Request - Dados inválidos
- `401`: Unauthorized - Não autenticado
- `403`: Forbidden - Sem permissão
- `404`: Not Found - Recurso não encontrado
- `409`: Conflict - Conflito (ex: registro duplicado)
- `500`: Internal Server Error - Erro interno

## 📚 Documentação Adicional

- [Backend README](backend/README.md) - Documentação detalhada da API
- [Frontend Mobile README](frontend-mobile2/README.md) - Guia do app mobile
- [Quick Start Guide](backend/docs/QUICKSTART.md) - Guia rápido de início
- [Mobile Setup](backend/MOBILE_SETUP.md) - Configuração para mobile

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade do Metrô de São Paulo e do Instituto Mauá de Tecnologia.

## 👥 Equipe

Desenvolvido para o Metrô de São Paulo.

---

**Metrô de São Paulo** - Sistema de Gestão de Construções

Para mais informações, acesse: [Documentação da API](http://localhost:8000/docs)

