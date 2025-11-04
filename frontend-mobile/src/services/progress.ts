import api from './api';
import { Progress, ProgressUploadData } from '../types/progress';
import { UploadProgressCallback } from '../types/api';

export const progressService = {
  /**
   * Registra um novo progresso com foto
   */
  register: async (
    formData: FormData,
    onUploadProgress?: UploadProgressCallback
  ): Promise<Progress> => {
    const response = await api.post<Progress>('/progress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  /**
   * Busca um progresso por ID
   */
  getById: async (id: string): Promise<Progress> => {
    const response = await api.get<Progress>(`/progress/${id}`);
    return response.data;
  },

  /**
   * Lista progressos de uma construção
   */
  listByConstruction: async (constructionId: string): Promise<Progress[]> => {
    const response = await api.get<Progress[]>(`/progress/construction/${constructionId}`);
    return response.data;
  },

  /**
   * Lista progressos por referência BIM
   */
  listByBIMReference: async (bimReferenceId: string): Promise<Progress[]> => {
    const response = await api.get<Progress[]>(`/progress/bim/${bimReferenceId}`);
    return response.data;
  },
};

