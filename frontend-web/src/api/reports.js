import client from './client';

export const reportsAPI = {
  generate: async (constructionId) => {
    const response = await client.post(`/reports/construction/${constructionId}`);
    return response.data;
  },

  getById: async (reportId) => {
    const response = await client.get(`/reports/${reportId}`);
    return response.data;
  },

  listByConstruction: async (constructionId) => {
    const response = await client.get(`/reports/construction/${constructionId}`);
    return response.data;
  },
};

