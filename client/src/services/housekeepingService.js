import api from './api';

const housekeepingService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/housekeeping', { params });
    return data;
  },
  getMyTasks: async () => {
    const { data } = await api.get('/housekeeping/my-tasks');
    return data.data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/housekeeping/${id}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/housekeeping', payload);
    return data.data;
  },
  updateStatus: async (id, status, notes) => {
    const { data } = await api.patch(`/housekeeping/${id}/status`, { status, notes });
    return data.data;
  },
  verify: async (id, supervisorNotes) => {
    const { data } = await api.patch(`/housekeeping/${id}/verify`, { supervisorNotes });
    return data.data;
  },
};

export default housekeepingService;

