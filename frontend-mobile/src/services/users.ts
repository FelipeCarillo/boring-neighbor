import api from './api';
import { User, UserUpdateData } from '../types/user';

export const usersService = {
  /**
   * Lista todos os usuários (apenas para supervisores)
   */
  list: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Busca um usuário por ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Atualiza dados do usuário
   */
  update: async (id: string, data: UserUpdateData): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Atualiza senha do usuário
   */
  updatePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.put(`/users/${id}/password`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

