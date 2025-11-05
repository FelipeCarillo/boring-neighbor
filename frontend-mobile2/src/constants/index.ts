// API Base URL
// IMPORTANTE: Para React Native, use o IP da sua máquina ao invés de localhost
// Exemplo: http://192.168.1.100:8000/api
// Para descobrir seu IP:
// Windows: ipconfig (procure por IPv4)
// Mac/Linux: ifconfig ou ip addr
export const API_BASE_URL = 'http://10.2.0.177:8000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERADOR: 'OPERADOR',
} as const;

// Construction Status
export const CONSTRUCTION_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
} as const;

export const CONSTRUCTION_STATUS_LABELS = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  ON_HOLD: 'Em Espera',
  CANCELLED: 'Cancelada',
};

export const CONSTRUCTION_STATUS_COLORS = {
  PLANNED: '#0455BF',
  IN_PROGRESS: '#00903E',
  COMPLETED: '#00903E',
  ON_HOLD: '#FBD12D',
  CANCELLED: '#EE3124',
};

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'metro_access_token',
  REFRESH_TOKEN: 'metro_refresh_token',
  USER: 'metro_user',
};

// Metro SP Theme Colors
export const METRO_COLORS = {
  PRIMARY: '#0455BF',      // Linha 1 - Azul
  SECONDARY: '#EE3124',    // Linha 3 - Vermelho
  SUCCESS: '#00903E',      // Linha 2 - Verde
  WARNING: '#FBD12D',      // Linha 4 - Amarelo
  BACKGROUND: '#FAFAFA',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
};

