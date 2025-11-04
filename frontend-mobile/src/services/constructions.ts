import api from './api';
import { Construction } from '../types/construction';

export const constructionsService = {
  /**
   * Lista todas as construções
   */
  list: async (): Promise<Construction[]> => {
    const response = await api.get<Construction[]>('/constructions');
    return response.data;
  },

  /**
   * Busca uma construção por ID
   */
  getById: async (id: string): Promise<Construction> => {
    const response = await api.get<Construction>(`/constructions/${id}`);
    return response.data;
  },

  /**
   * Busca timeline de uma construção
   */
  getTimeline: async (id: string): Promise<any[]> => {
    const response = await api.get(`/constructions/${id}/timeline`);
    return response.data;
  },
};

