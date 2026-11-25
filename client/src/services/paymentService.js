import api from './api';

const paymentService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/payments', { params });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/payments/${id}`);
    return data.data;
  },
  record: async (payload) => {
    const { data } = await api.post('/payments', payload);
    return data.data;
  },
  refund: async (id, payload) => {
    const { data } = await api.post(`/payments/${id}/refund`, payload);
    return data.data;
  },
};

export default paymentService;

