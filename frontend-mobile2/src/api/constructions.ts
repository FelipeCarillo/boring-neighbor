import client from './client';
import { Construction } from '../types';

export const constructionsAPI = {
  list: async (): Promise<Construction[]> => {
    const response = await client.get('/constructions');
    return response.data;
  },

  getById: async (constructionId: string | number): Promise<Construction> => {
    const response = await client.get(`/constructions/${constructionId}`);
    return response.data;
  },

  uploadBIMAnalysis: async (constructionId: string | number, formData: FormData): Promise<any> => {
    const response = await client.post(`/constructions/${constructionId}/bim-analysis`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

