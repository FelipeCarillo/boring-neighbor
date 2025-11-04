// API Base URL
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

// Log API URL on startup (only in development)
if (__DEV__) {
  console.log('🌐 API Base URL:', API_BASE_URL);
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERADOR: 'OPERADOR',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Construction Status
export const CONSTRUCTION_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
} as const;

export type ConstructionStatus = typeof CONSTRUCTION_STATUS[keyof typeof CONSTRUCTION_STATUS];

export const CONSTRUCTION_STATUS_LABELS: Record<ConstructionStatus, string> = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  ON_HOLD: 'Em Espera',
  CANCELLED: 'Cancelada',
};

export const CONSTRUCTION_STATUS_COLORS: Record<ConstructionStatus, string> = {
  PLANNED: '#0288D1',
  IN_PROGRESS: '#0455BF',
  COMPLETED: '#00903E',
  ON_HOLD: '#FBD12D',
  CANCELLED: '#EE3124',
};

// Deviation Score Thresholds
export const DEVIATION_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  ACCEPTABLE: 50,
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_QUALITY: 0.8, // Qualidade de compressão (0-1)
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
} as const;

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@metro_access_token',
  REFRESH_TOKEN: '@metro_refresh_token',
  USER: '@metro_user',
  CONSTRUCTIONS_CACHE: '@metro_constructions_cache',
  PENDING_UPLOADS: '@metro_pending_uploads',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// App Config
export const APP_CONFIG = {
  NAME: 'Metro SP - Gestão de Obras',
  VERSION: '1.0.0',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  REFRESH_INTERVAL: 30 * 1000, // 30 segundos
  UPLOAD_TIMEOUT: 60 * 1000, // 60 segundos
} as const;

