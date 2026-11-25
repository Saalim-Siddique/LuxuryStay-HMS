import api from './api';

const guestService = {
  search: async (query) => {
    const { data } = await api.get('/guests/search', { params: { q: query } });
    return data.data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/guests/${id}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/guests', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/guests/${id}`, payload);
    return data.data;
  },
  getProfile: async () => {
    const { data } = await api.get('/guests/me');
    return data.data;
  },
};

export default guestService;

