const os = require('os');
const fs = require('fs');
const path = require('path');

/**
 * Script para configurar automaticamente o IP da máquina no .env
 */

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

function setupEnv() {
  const localIp = getLocalIp();
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  console.log('🔍 Detectado IP local:', localIp);
  
  // Read .env.example
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  } else {
    envContent = `# API Configuration\nEXPO_PUBLIC_API_URL=http://${localIp}:8000/api\n`;
  }
  
  // Replace IP in content
  envContent = envContent.replace(
    /EXPO_PUBLIC_API_URL=http:\/\/\d+\.\d+\.\d+\.\d+:8000\/api/g,
    `EXPO_PUBLIC_API_URL=http://${localIp}:8000/api`
  );
  
  // If no replacement was made, add the line
  if (!envContent.includes('EXPO_PUBLIC_API_URL=')) {
    envContent += `\nEXPO_PUBLIC_API_URL=http://${localIp}:8000/api\n`;
  }
  
  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Arquivo .env criado/atualizado!');
  console.log(`📱 URL da API configurada: http://${localIp}:8000/api`);
  console.log('');
  console.log('🚀 Próximos passos:');
  console.log('1. Certifique-se de que o backend está rodando:');
  console.log('   cd backend && uvicorn src.main:app --reload --host 0.0.0.0 --port 8000');
  console.log('');
  console.log('2. Configure CORS no backend (veja backend/MOBILE_SETUP.md)');
  console.log('');
  console.log('3. Inicie o app mobile:');
  console.log('   npm start');
  console.log('');
  console.log('⚠️  IMPORTANTE: O backend deve aceitar conexões em', localIp);
}

setupEnv();

