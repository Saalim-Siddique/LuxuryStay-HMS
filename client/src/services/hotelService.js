import api from './api';

const hotelService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/hotels', { params });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/hotels/${id}`);
    return data.data;
  },
  getBySlug: async (slug) => {
    const { data } = await api.get(`/hotels/public/${slug}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/hotels', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/hotels/${id}`, payload);
    return data.data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/hotels/${id}`);
    return data;
  },
};

export default hotelService;

