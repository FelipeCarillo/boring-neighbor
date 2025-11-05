# Frontend Mobile - App Operador/Supervisor

Aplicativo React Native (Expo) para operadores e supervisores gerenciarem obras e enviarem fotos para análise BIM.

## 📱 Funcionalidades

- ✅ Autenticação com registro e senha
- ✅ Lista de obras atribuídas ao usuário
- ✅ Visualização de detalhes da obra
- ✅ Captura de múltiplas fotos (câmera ou galeria)
- ✅ Envio de fotos para análise BIM
- ✅ Perfil do usuário
- ✅ Interface simples e responsiva

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- Dispositivo móvel ou emulador configurado

### Instalação de Dependências

```bash
cd frontend-mobile2
npm install
```

## ⚙️ Configuração

### ⚠️ IMPORTANTE: Configuração da URL da API

**No React Native, `localhost` não funciona** quando você está testando em dispositivo físico ou emulador. Você precisa usar o **IP da sua máquina**.

### Passo 1: Descobrir seu IP

#### Windows:
```bash
ipconfig
```
Procure por **IPv4 Address** (geralmente algo como `192.168.1.100` ou `10.2.0.177`)

#### Mac/Linux:
```bash
ifconfig
# ou
ip addr
```

### Passo 2: Configurar no App

#### Opção 1: Variável de Ambiente (Recomendado)

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://10.2.0.177:8000/api
```

**Substitua `10.2.0.177` pelo IP da sua máquina.**

#### Opção 2: Editar o Código

Edite `src/constants/index.ts`:

```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.2.0.177:8000/api';
```

### Passo 3: Reiniciar o App

Após alterar a configuração, reinicie o servidor Expo:

```bash
# Limpar cache e reiniciar
npx expo start -c
```

### 🔍 Solução de Problemas

Se você encontrar erros de conexão, consulte o arquivo [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para instruções detalhadas.

## 🏃 Executando o App

### Desenvolvimento

```bash
npm start
```

Depois escaneie o QR code com o app Expo Go ou pressione:
- `a` para Android
- `i` para iOS
- `w` para web

### Build

```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 📁 Estrutura do Projeto

```
frontend-mobile2/
├── app/                    # Rotas (Expo Router)
│   ├── login.tsx          # Tela de login
│   ├── (tabs)/            # Tabs principais
│   │   ├── index.tsx      # Dashboard/Obras
│   │   └── profile.tsx    # Perfil
│   └── construction/      # Detalhes da obra
│       └── [id].tsx
├── src/
│   ├── api/               # Serviços de API
│   │   ├── client.ts      # Cliente axios configurado
│   │   ├── auth.ts        # Autenticação
│   │   ├── constructions.ts
│   │   └── progress.ts
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ConstructionCard.tsx
│   │   ├── PhotoCapture.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.tsx
│   ├── constants/         # Constantes
│   │   └── index.ts
│   └── types/             # TypeScript types
│       └── index.ts
└── package.json
```

## 🎨 Tema

O aplicativo utiliza as cores do Metrô de São Paulo:

- **Primary**: `#0455BF` (Linha 1 - Azul)
- **Secondary**: `#EE3124` (Linha 3 - Vermelho)
- **Success**: `#00903E` (Linha 2 - Verde)
- **Warning**: `#FBD12D` (Linha 4 - Amarelo)

## 📸 Permissões

O app precisa das seguintes permissões:

- **Câmera**: Para tirar fotos das obras
- **Galeria**: Para selecionar fotos da galeria

Essas permissões são solicitadas automaticamente quando necessário.

## 🔐 Autenticação

O aplicativo utiliza JWT tokens:
- Access token armazenado no AsyncStorage
- Refresh token para renovação automática
- Logout limpa todos os tokens

## 📡 API

### Endpoints Utilizados

- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário
- `POST /auth/refresh` - Refresh token
- `GET /constructions` - Lista de obras
- `GET /constructions/:id` - Detalhes da obra
- `POST /constructions/:id/bim-analysis` - Upload de fotos para análise BIM

**Nota**: O endpoint `/bim-analysis` pode precisar ser implementado no backend para aceitar múltiplas fotos.

## 👥 Roles

- **OPERADOR**: Pode visualizar obras atribuídas e enviar fotos
- **SUPERVISOR**: Mesmas permissões do operador
- **ADMIN**: Não pode acessar este app (use o frontend-web)

## 🛠️ Tecnologias

- React Native 0.81.5
- Expo SDK 54
- Expo Router 6
- TypeScript 5.9
- Axios
- AsyncStorage
- Expo Image Picker
- Expo Camera

## 📝 Notas

- O app filtra automaticamente apenas obras atribuídas ao usuário logado
- As fotos podem ser tiradas pela câmera ou selecionadas da galeria
- Múltiplas fotos podem ser enviadas em um único envio
- A interface é otimizada para mobile-first

## 🐛 Troubleshooting

### Erro de Câmera
- Verifique se as permissões foram concedidas
- No iOS, verifique o Info.plist
- No Android, verifique o AndroidManifest.xml

### Erro de API
- Verifique se o backend está rodando
- Verifique a URL da API no arquivo `.env`
- Verifique se o token está sendo enviado corretamente

### Build Errors
- Limpe o cache: `npx expo start -c`
- Reinstale as dependências: `rm -rf node_modules && npm install`
