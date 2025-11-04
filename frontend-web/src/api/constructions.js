import client from './client';

export const constructionsAPI = {
  create: async (constructionData) => {
    const response = await client.post('/constructions', constructionData);
    return response.data;
  },

  list: async () => {
    const response = await client.get('/constructions');
    return response.data;
  },

  getById: async (constructionId) => {
    const response = await client.get(`/constructions/${constructionId}`);
    return response.data;
  },

  update: async (constructionId, constructionData) => {
    const response = await client.put(`/constructions/${constructionId}`, constructionData);
    return response.data;
  },

  delete: async (constructionId) => {
    const response = await client.delete(`/constructions/${constructionId}`);
    return response.data;
  },

  assignUsers: async (constructionId, userIds) => {
    const response = await client.post(`/constructions/${constructionId}/users`, {
      user_ids: userIds,
    });
    return response.data;
  },

  removeUser: async (constructionId, userId) => {
    const response = await client.delete(`/constructions/${constructionId}/users/${userId}`);
    return response.data;
  },

  uploadBIM: async (constructionId, formData) => {
    const response = await client.post(`/constructions/${constructionId}/bim`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteBIM: async (constructionId, bimId) => {
    const response = await client.delete(`/constructions/${constructionId}/bim/${bimId}`);
    return response.data;
  },

  uploadModel3D: async (constructionId, formData) => {
    const response = await client.post(`/constructions/${constructionId}/model-3d`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteModel3D: async (constructionId) => {
    const response = await client.delete(`/constructions/${constructionId}/model-3d`);
    return response.data;
  },

  getTimeline: async (constructionId) => {
    const response = await client.get(`/constructions/${constructionId}/timeline`);
    return response.data;
  },
};

