# Configuração da API - Solução de Problemas de Rede

## ❌ Problema: Network Error

O erro "Network Error" geralmente ocorre quando o aplicativo React Native não consegue se conectar ao backend.

## ✅ Solução: Configurar o IP da Máquina

No React Native, **`localhost` não funciona** quando você está testando em um dispositivo físico ou emulador. Você precisa usar o **IP da sua máquina**.

### Passo 1: Descobrir seu IP

#### Windows:
```bash
ipconfig
```
Procure por **IPv4 Address** na sua conexão ativa (geralmente algo como `192.168.1.100`)

#### Mac/Linux:
```bash
ifconfig
# ou
ip addr
```
Procure por `inet` na sua interface de rede (geralmente `en0` ou `wlan0`)

### Passo 2: Configurar no App

#### Opção 1: Variável de Ambiente (Recomendado)

Crie um arquivo `.env` na raiz do projeto `frontend-mobile2`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api
```

Substitua `192.168.1.100` pelo IP da sua máquina.

#### Opção 2: Editar o Código

Edite `frontend-mobile2/src/constants/index.ts`:

```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8000/api';
```

### Passo 3: Reiniciar o App

Após alterar a configuração:

1. Pare o servidor Expo (`Ctrl+C`)
2. Limpe o cache: `npx expo start -c`
3. Ou reinstale: `rm -rf node_modules && npm install && npm start`

### Passo 4: Verificar Backend

Certifique-se de que o backend está:
- ✅ Rodando na porta 8000
- ✅ Acessível na rede local (não apenas localhost)
- ✅ Configurado para aceitar requisições do IP do dispositivo

### Exemplo de Configuração Correta

```
Backend rodando em: http://192.168.1.100:8000
App configurado com: http://192.168.1.100:8000/api
```

## 🔍 Outros Problemas Comuns

### CORS (Cross-Origin Resource Sharing)

Se o backend retornar erros de CORS, configure o backend para aceitar requisições do Expo:

```python
# No backend (exemplo FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, use domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Firewall

Certifique-se de que o firewall do Windows/Mac não está bloqueando a porta 8000.

### Emulador Android

- Android Emulator: Use `10.0.2.2` ao invés do IP local
- Dispositivo físico: Use o IP da máquina normalmente

### iOS Simulator

- iOS Simulator: `localhost` funciona normalmente
- Dispositivo físico: Use o IP da máquina

## 🧪 Teste de Conexão

Para testar se o backend está acessível:

1. Abra o navegador no dispositivo/emulador
2. Acesse: `http://192.168.1.100:8000/docs` (ou a URL do seu backend)
3. Se conseguir acessar, o app também conseguirá

## 📝 Checklist

- [ ] Descobriu o IP da máquina
- [ ] Configurou `EXPO_PUBLIC_API_URL` no `.env` ou código
- [ ] Reiniciou o app Expo
- [ ] Backend está rodando e acessível
- [ ] Testou a conexão no navegador do dispositivo
- [ ] Verificou se firewall não está bloqueando

## 💡 Dica

Se você mudar de rede WiFi frequentemente, considere criar um script para detectar o IP automaticamente ou usar um serviço como ngrok para desenvolvimento.

