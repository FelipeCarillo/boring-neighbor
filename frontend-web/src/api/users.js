import client from './client';

export const usersAPI = {
  create: async (userData) => {
    const response = await client.post('/users', userData);
    return response.data;
  },

  list: async () => {
    const response = await client.get('/users');
    return response.data;
  },

  getById: async (userId) => {
    const response = await client.get(`/users/${userId}`);
    return response.data;
  },

  update: async (userId, userData) => {
    const response = await client.put(`/users/${userId}`, userData);
    return response.data;
  },

  delete: async (userId) => {
    const response = await client.delete(`/users/${userId}`);
    return response.data;
  },
};

