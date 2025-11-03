# Quick Start Guide - Metro SP Backend

## Setup em 5 minutos

### 1. Instalar dependências

```bash
cd backend
pip install -e .
```

### 2. Subir infraestrutura (PostgreSQL + MinIO)

```bash
cd ../deploy/infra
docker-compose up -d
```

### 3. Criar arquivo .env

```bash
cd ../../backend
cp .env.example .env
```

**IMPORTANTE**: Se for usar OpenAI, adicione sua API key no `.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

### 4. Inicializar banco de dados

```bash
chmod +x scripts/init_db.sh
./scripts/init_db.sh
```

Isso vai:
- Criar as tabelas no banco
- Criar um usuário admin padrão

### 5. Rodar a aplicação

```bash
python run.py
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Login Inicial

Use estas credenciais para fazer login:

```json
{
  "registro": "0000001",
  "password": "admin123"
}
```

**⚠️ Troque a senha após o primeiro login!**

## Testando a API

### 1. Fazer Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "registro": "0000001",
    "password": "admin123"
  }'
```

Vai retornar:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {...}
}
```

### 2. Criar uma Obra

```bash
curl -X POST http://localhost:8000/api/constructions/ \
  -H "Authorization: Bearer {seu_access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Estação Vila Madalena",
    "description": "Nova estação da linha 2",
    "location": "Vila Madalena, São Paulo",
    "start_date": "2025-01-15"
  }'
```

### 3. Upload de Foto BIM

```bash
curl -X POST http://localhost:8000/api/constructions/{construction_id}/bim \
  -H "Authorization: Bearer {seu_access_token}" \
  -F "file=@/path/to/bim_image.jpg" \
  -F "description=Planta estrutural"
```

### 4. Registrar Progresso

```bash
curl -X POST http://localhost:8000/api/progress/ \
  -H "Authorization: Bearer {seu_access_token}" \
  -F "construction_id={construction_id}" \
  -F "file=@/path/to/progress_photo.jpg" \
  -F "notes=Estrutura 70% concluída"
```

### 5. Gerar Relatório com IA

```bash
curl -X POST http://localhost:8000/api/reports/construction/{construction_id} \
  -H "Authorization: Bearer {seu_access_token}"
```

## Acessar Swagger UI

Abra o navegador em: http://localhost:8000/docs

Lá você pode:
1. Clicar em "Authorize"
2. Inserir: `Bearer {seu_access_token}`
3. Testar todas as rotas interativamente

## Estrutura de Pastas

```
backend/
├── src/
│   ├── configs/          # Configurações (env.py)
│   ├── entities/         # Modelos Pydantic (request/response)
│   ├── helpers/          # Helpers (auth, errors, enums)
│   ├── infra/            # S3, serviços externos
│   ├── repositories/     # Models SQLAlchemy + Repositories
│   ├── router/           # Routes (auth, users, constructions, etc)
│   ├── services/         # Serviços (deviation, OpenAI)
│   └── main.py           # FastAPI app
├── scripts/              # Scripts utilitários
├── alembic/              # Migrations
└── run.py                # Entry point
```

## Troubleshooting

### Erro de conexão com banco

Verifique se o PostgreSQL está rodando:
```bash
docker ps | grep postgres
```

### Erro de S3/MinIO

Verifique se o MinIO está rodando:
```bash
docker ps | grep minio
```

Acesse o console: http://localhost:9001
- User: minio
- Password: minio123

### Erro "OpenAI API key not configured"

Adicione a chave no `.env`:
```
OPENAI_API_KEY=sk-your-key-here
```

## Próximos Passos

1. **Criar usuários**: Use o endpoint POST `/api/users/` para criar SUPERVISORES e OPERADORES
2. **Cadastrar obras**: Crie construções e atribua usuários
3. **Upload BIM**: Faça upload das plantas de referência
4. **Registrar progresso**: Operadores registram fotos do andamento
5. **Gerar relatórios**: Supervisores geram análises com IA

## Documentação Completa

Ver `API_DOCS.md` para documentação detalhada de todos os endpoints.


