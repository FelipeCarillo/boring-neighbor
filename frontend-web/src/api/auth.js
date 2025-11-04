import client from './client';

export const authAPI = {
  login: async (registro, password) => {
    const response = await client.post('/auth/login', {
      registro,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
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

