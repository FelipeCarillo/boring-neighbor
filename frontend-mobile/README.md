# Metro SP - App Mobile

Aplicativo mobile para gestão de obras do Metrô de São Paulo, desenvolvido com Expo e React Native.

## 🚀 Funcionalidades

- **Autenticação**: Login seguro com registro e senha
- **Dashboard**: Visualização macro de obras e usuários
- **Lista de Obras**: Busca e visualização de todas as obras
- **Detalhes da Obra**: Informações completas e galeria de progresso
- **📸 Captura de Foto**: Registro de progresso com câmera nativa (FUNCIONALIDADE PRINCIPAL)
- **Comparação BIM**: Visualização de similaridade entre foto real e modelo BIM
- **Perfil**: Gerenciamento de dados pessoais e senha

## 🎨 Design

- Paleta de cores do Metrô SP (Azul, Verde, Vermelho, Amarelo)
- Interface moderna e minimalista
- Componentes reutilizáveis
- Animações suaves
- Design responsivo

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou Xcode (para simulador iOS)
- Dispositivo físico com Expo Go (opcional)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd boring-neighbor/frontend-mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Configure automaticamente o IP da sua máquina:
```bash
npm run setup
```

Ou manualmente, copie o exemplo e edite:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:
```
EXPO_PUBLIC_API_URL=http://SEU_IP:8000/api
```

**⚠️ IMPORTANTE**: 
- Para testar no dispositivo físico, use o IP da sua máquina, não `localhost`
- Para descobrir seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
- Exemplo: `http://192.168.1.100:8000/api`

4. Configure o CORS no backend:

Veja instruções detalhadas em [`backend/MOBILE_SETUP.md`](../backend/MOBILE_SETUP.md).

Resumo rápido - edite `backend/src/configs/env.py`:
```python
cors_origins: list[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "*",  # Para desenvolvimento
]
```

5. Inicie o backend com host 0.0.0.0:
```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## 📱 Executando o App

### Desenvolvimento

```bash
npm start
```

Isso abrirá o Expo Dev Tools no navegador. Você pode então:
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no simulador iOS
- Escanear o QR code com o app Expo Go no seu dispositivo

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## 🏗️ Estrutura do Projeto

```
frontend-mobile/
├── app/                          # Rotas do Expo Router
│   ├── (auth)/                   # Rotas de autenticação
│   │   └── login.tsx
│   ├── (tabs)/                   # Tabs principais
│   │   ├── index.tsx            # Dashboard
│   │   ├── obras.tsx            # Lista de obras
│   │   └── perfil.tsx           # Perfil
│   ├── obra/
│   │   └── [id].tsx             # Detalhes da obra
│   ├── progresso/
│   │   ├── camera.tsx           # Captura de foto (CORE)
│   │   └── [id].tsx             # Detalhes do progresso
│   └── _layout.tsx              # Root layout
├── src/
│   ├── components/              # Componentes reutilizáveis
│   ├── contexts/                # Context API (Auth)
│   ├── services/                # API services
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utilitários (constants, formatters, storage)
│   ├── hooks/                   # Custom hooks
│   └── theme/                   # Tema (cores, tipografia)
└── assets/                      # Imagens e recursos
```

## 🔑 Funcionalidades Principais

### 1. Captura de Foto (CORE)

A funcionalidade mais importante do app é a captura de fotos para registrar o progresso das obras:

1. Acesse uma obra
2. Toque no botão FAB (câmera)
3. Capture a foto
4. Selecione referência BIM (opcional)
5. Adicione observações (opcional)
6. Envie o registro

### 2. Comparação BIM

Após o registro, se houver uma referência BIM, o backend processará e retornará um score de similaridade (0-100%).

### 3. Offline First

- Dados são cacheados localmente
- Tokens persistem entre sessões
- Funciona offline (visualização)

## 📦 Dependências Principais

- `expo`: Framework
- `expo-router`: Roteamento file-based
- `expo-camera`: Acesso à câmera
- `expo-image-picker`: Seleção de imagens
- `expo-image`: Otimização de imagens
- `axios`: Cliente HTTP
- `@react-native-async-storage/async-storage`: Persistência local
- `date-fns`: Manipulação de datas
- `react-native-toast-message`: Notificações

## 🎨 Tema e Cores

```typescript
primary: '#0455BF',      // Azul Linha 1
secondary: '#EE3124',    // Vermelho Linha 3
success: '#00903E',      // Verde Linha 2
warning: '#FBD12D',      // Amarelo Linha 4
```

## 🚫 O que NÃO está incluído

- Visualização de modelo 3D (apenas no web)
- Edição de obras (apenas visualização)
- Gestão de usuários (apenas no web para admin)

## 🐛 Troubleshooting

### ❌ Problema: Texto não aparece ou não consigo digitar no input

**Solução**:
1. Limpe o cache do Metro bundler:
```bash
npx expo start --clear
```

2. Se estiver no Expo Go, limpe o cache do app:
   - Android: Settings → Apps → Expo Go → Clear Cache
   - iOS: Delete e reinstale o Expo Go

3. Verifique se reiniciou após as mudanças no código

### ❌ Problema: "Network Error" ou requisições OPTIONS em vez de POST

**Causa**: Problema de CORS no backend.

**Solução**:
1. Configure CORS no backend (`backend/src/configs/env.py`):
```python
cors_origins: list[str] = ["*"]  # Para desenvolvimento
```

2. Reinicie o backend com `--host 0.0.0.0`:
```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

3. Verifique se o `.env` do mobile tem o IP correto:
```bash
npm run setup  # Configura automaticamente
```

4. Teste a API no navegador: `http://SEU_IP:8000/docs`

### ❌ Problema: Textos sobrepostos no desktop/web

**Causa**: O app foi otimizado para mobile.

**Solução**: Use um emulador ou dispositivo físico para melhor experiência. O web é experimental.

### ❌ Problema: "Cannot connect to API"

**Soluções**:
- ✅ Certifique-se de que está na mesma rede Wi-Fi
- ✅ Use o IP da máquina, não `localhost`
- ✅ Verifique se o backend está rodando: `http://SEU_IP:8000/docs`
- ✅ Verifique se MinIO e PostgreSQL estão rodando
- ✅ Verifique se o firewall não está bloqueando a porta 8000
- ✅ Execute `npm run setup` para configurar o IP automaticamente

## 📝 Notas

- Certifique-se de que o backend está rodando antes de testar o app
- Para teste em dispositivo físico, use o IP da máquina, não `localhost`
- As permissões de câmera serão solicitadas ao acessar a funcionalidade
- Compressão automática de imagens antes do upload

## 🔐 Autenticação

O app usa JWT tokens com refresh automático:
- Access token: curta duração
- Refresh token: longa duração
- Renovação automática ao expirar

## 📄 Licença

© 2024 Metrô de São Paulo
