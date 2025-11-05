import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Request interceptor para adicionar token
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Para FormData no React Native, remover Content-Type padrão
    // para permitir que o axios defina automaticamente com boundary
    if (config.data instanceof FormData) {
      if (config.headers) {
        // Remove o Content-Type padrão (application/json) se existir
        delete config.headers['Content-Type'];
        // Se Content-Type foi definido manualmente nos headers da requisição,
        // deixa ele (será sobrescrito pelo axios com boundary correto)
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para tratar erros
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Tratamento de erros de rede
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Tempo de requisição esgotado. Verifique sua conexão.';
      } else if (error.message === 'Network Error') {
        const isLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
        if (isLocalhost && Platform.OS !== 'web') {
          error.message = 'Erro de conexão. Use o IP da sua máquina ao invés de localhost. Ex: http://192.168.1.100:8000/api';
        } else {
          error.message = 'Erro de conexão. Verifique se o servidor está rodando e acessível.';
        }
      }
      return Promise.reject(error);
    }

    // Se erro 401 e não é retry, tenta refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return client(originalRequest);
        }
      } catch (refreshError) {
        // Se refresh falhar, limpa storage
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER,
        ]);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

