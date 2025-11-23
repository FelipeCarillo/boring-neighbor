```markdown
# boring-neighbor

Um monorepo para o projeto "boring-neighbor" — inclui backend, frontend web (Electron + Vite), frontend mobile (Expo React Native) e infraestrutura (IaC). Este README reúne instruções práticas para desenvolver, executar e empacotar todas as partes do projeto.

Sobre
------
Este repositório contém os componentes necessários para executar a aplicação em múltiplas plataformas:
- Web/Desktop (Electron) — app construído com React + Vite + TypeScript + Electron
- Mobile — app construído com Expo (React Native)
- Backend — API/serviços (pasta backend)
- IaC — infraestrutura em CDK Python para provisionamento (pasta iac)
- Scripts de deploy (pasta deploy)

Estrutura do repositório
------------------------
- .expo/                — arquivos de configuração do Expo
- .github/              — workflows / templates (se presentes)
- backend/              — código do servidor / API
- frontend-web/         — aplicação web/desktop (Vite + React + Electron)
- frontend-mobile/      — aplicação mobile (Expo)
- iac/                  — infraestrutura como código (CDK Python)
- deploy/               — scripts/artefatos de deploy
- .gitignore

Tecnologias principais (resumo)
----------------------------------------------
Frontend Web (frontend-web/package.json):
- React 18, Vite, TypeScript, Tailwind CSS
- Electron + electron-builder
- Ferramentas: eslint, @typescript-eslint

Frontend Mobile (frontend-mobile/package.json):
- Expo, React 19, React Native 0.81.x
- React Navigation, MUI (parcial), expo-camera, expo-media-library

IaC:
- AWS CDK em Python (Implementação futura)

Pré-requisitos
--------------
- Node.js (LTS recomendado) e npm ou yarn
- Para mobile: Expo CLI (opcional; pode usar npx expo)
- Para desktop/Electron: dependências de build do electron-builder
- Python 3.x e pip (para IaC/CDK)

Executando localmente
---------------------

1) Instalação por subprojeto
- frontend-web:
  cd frontend-web
  npm install
- frontend-mobile:
  cd frontend-mobile
  npm install
- backend:
  cd backend
  python -m venv .venv
  source .venv/bin/activate   # macOS/Linux
  .venv\Scripts\activate      # Windows
  pip install -r requirements.txt

2) Frontend Web (desenvolvimento)
- cd frontend-web
- npm run dev
- Acesse o endereço exibido pelo Vite (ex.: http://localhost:5173)

3) Frontend Web (build/empacotamento)
- cd frontend-web
- npm run build
- O script realiza: tsc && vite build && electron-builder — verifique config do electron-builder para artefatos gerados.

4) Frontend Mobile (Expo)
- cd frontend-mobile
- npm run start
- npm run android  # emulador/dispositivo Android
- npm run ios      # emulador/dispositivo iOS
- npm run web      # web via react-native-web
- Para builds nativos considere usar EAS Build (Expo Application Services)

5) Backend
- cd backend
- uv sync
- uv run run.py

Variáveis de ambiente
---------------------
Cada subprojeto pode exigir variáveis diferentes. Recomenda-se criar arquivos .env.local/.env.example em cada subprojeto com valores de exemplo.

Exemplo de .env.example (placeholders)
- BACKEND_PORT=4000
- DATABASE_URL=postgres://user:pass@host:5432/dbname
- JWT_SECRET=uma_chave_forte
- EXPO_PUBLIC_API_URL=http://localhost:4000/api
