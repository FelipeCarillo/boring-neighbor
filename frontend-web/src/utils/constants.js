// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SUPERVISOR: 'SUPERVISOR',
  OPERADOR: 'OPERADOR',
};

// Construction Status
export const CONSTRUCTION_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED',
};

export const CONSTRUCTION_STATUS_LABELS = {
  PLANNED: 'Planejada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  ON_HOLD: 'Em Espera',
  CANCELLED: 'Cancelada',
};

export const CONSTRUCTION_STATUS_COLORS = {
  PLANNED: 'info',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success',
  ON_HOLD: 'warning',
  CANCELLED: 'error',
};

// Deviation Score Thresholds
export const DEVIATION_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  ACCEPTABLE: 50,
};

// File Upload Limits
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MODEL_3D_MAX_SIZE: null, // Sem limite para modelos 3D
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_3D_MODEL_TYPES: ['.obj', '.gltf', '.glb', '.fbx'],
  ACCEPTED_3D_MODEL_MIME_TYPES: [
    'application/octet-stream',
    'model/obj',
    'model/gltf+json',
    'model/gltf-binary',
    'application/x-fbx',
  ],
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'metro_access_token',
  REFRESH_TOKEN: 'metro_refresh_token',
  USER: 'metro_user',
};



