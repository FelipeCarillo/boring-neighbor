import { apiClient } from './client';
import { User, TokenResponse } from '../types';

export const authApi = {
  async login(rg: string, password: string): Promise<TokenResponse> {
    return apiClient.login(rg, password);
  },

  async getMe(): Promise<User> {
    return apiClient.getMe();
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
