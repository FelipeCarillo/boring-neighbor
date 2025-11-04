import client from './client';

export const progressAPI = {
  register: async (formData) => {
    const response = await client.post('/progress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getById: async (progressId) => {
    const response = await client.get(`/progress/${progressId}`);
    return response.data;
  },

  listByConstruction: async (constructionId) => {
    const response = await client.get(`/progress/construction/${constructionId}`);
    return response.data;
  },

  listByBIMReference: async (bimReferenceId) => {
    const response = await client.get(`/progress/bim/${bimReferenceId}`);
    return response.data;
  },
};

