import api from './api';

const bookingService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/bookings', { params });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/bookings', payload);
    return data.data;
  },
  confirm: async (id) => {
    const { data } = await api.put(`/bookings/${id}/confirm`);
    return data.data;
  },
  cancel: async (id, reason) => {
    const { data } = await api.put(`/bookings/${id}/cancel`, { reason });
    return data.data;
  },
  checkAvailability: async (params) => {
    const { data } = await api.get('/rooms/available', { params });
    return data.data;
  },
};

export default bookingService;

