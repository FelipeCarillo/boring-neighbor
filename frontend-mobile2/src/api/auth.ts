import client from './client';
import { AuthResponse } from '../types';

export const authAPI = {
  login: async (registro: string, password: string): Promise<AuthResponse> => {
    const response = await client.post('/auth/login', {
      registro,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await client.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },
};

