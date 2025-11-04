import api from './api';
import { LoginResponse, RefreshTokenResponse } from '../types/auth';
import { User } from '../types/user';

export const authService = {
  /**
   * Login com registro e senha
   */
  login: async (registro: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      registro,
      password,
    });
    return response.data;
  },

  /**
   * Refresh do token de acesso
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Busca dados do usuário autenticado
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

