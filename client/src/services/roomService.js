import api from './api';

const roomService = {
  getAll: async (hotelId, params = {}) => {
    const { data } = await api.get('/rooms', { params: { hotelId, ...params } });
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/rooms/${id}`);
    return data.data;
  },
  getAvailable: async (params) => {
    const { data } = await api.get('/rooms/available', { params });
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/rooms', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/rooms/${id}`, payload);
    return data.data;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/rooms/${id}/status`, { status });
    return data.data;
  },
};

export default roomService;

