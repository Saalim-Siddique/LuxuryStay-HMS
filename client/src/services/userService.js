import api from './api';

const userService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/users', { params });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/users', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.data;
  },
  deactivate: async (id) => {
    const { data } = await api.patch(`/users/${id}/deactivate`);
    return data.data;
  },
  getProfile: async () => {
    const { data } = await api.get('/users/me');
    return data.data;
  },
};

export default userService;

