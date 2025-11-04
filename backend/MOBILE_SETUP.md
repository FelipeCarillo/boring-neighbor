# Configuração para App Mobile

Para que o app mobile funcione corretamente, você precisa ajustar as configurações de CORS no backend.

## 1. Configure o CORS

Edite o arquivo `backend/src/configs/env.py` ou crie um arquivo `.env` na pasta `backend/`:

### Opção A: Editar env.py diretamente

```python
cors_origins: list[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8081",      # Expo web
    "http://localhost:19000",     # Expo dev server
    "http://localhost:19006",     # Expo alternative port
    "*",                          # TEMPORÁRIO para desenvolvimento
]
```

### Opção B: Criar arquivo .env (RECOMENDADO)

Crie o arquivo `backend/.env`:

```env
# Database
DATABASE_URL=postgresql+psycopg2://admin:secret@localhost:5432/boring_neighbor

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# S3/MinIO
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET_NAME=metro-sp-constructions
S3_REGION=us-east-1

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4

# CORS - Adicione seu IP local aqui
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:8081","http://localhost:19000","http://192.168.1.100:8081","*"]
```

**IMPORTANTE**: Substitua `192.168.1.100` pelo IP da sua máquina na rede local.

Para descobrir seu IP:
- Windows: `ipconfig` (procure por "IPv4 Address")
- Mac/Linux: `ifconfig` ou `ip addr`

## 2. Configure a URL da API no Mobile

Edite o arquivo `frontend-mobile/.env`:

```env
# Substitua pelo IP da sua máquina (NÃO use localhost para dispositivo físico!)
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api
```

## 3. Reinicie o Backend

Após fazer as alterações, reinicie o servidor FastAPI:

```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

O `--host 0.0.0.0` é importante para que o servidor aceite conexões de outros dispositivos na rede.

## 4. Teste o App Mobile

```bash
cd frontend-mobile
npm start
```

Escaneie o QR code com o Expo Go ou pressione `a` para Android / `i` para iOS.

## Troubleshooting

### Problema: "Network Error" ou "OPTIONS request"
- ✅ Verifique se o backend está rodando com `--host 0.0.0.0`
- ✅ Verifique se o IP no `.env` está correto
- ✅ Verifique se o firewall não está bloqueando a porta 8000
- ✅ Teste a URL no navegador: `http://SEU_IP:8000/docs`

### Problema: "Cannot connect to API"
- ✅ Certifique-se de que está na mesma rede Wi-Fi
- ✅ Use o IP da máquina, não `localhost`
- ✅ Verifique se MinIO e PostgreSQL estão rodando

### Problema: Texto não aparece no input
- ✅ Reinicie o Metro bundler: `npx expo start --clear`
- ✅ Limpe o cache do Expo Go no dispositivo

## Segurança em Produção

**ATENÇÃO**: O CORS com `"*"` é apenas para desenvolvimento!

Em produção, configure origins específicas:

```python
cors_origins: list[str] = [
    "https://seu-dominio.com",
    "https://app.seu-dominio.com",
]
```

