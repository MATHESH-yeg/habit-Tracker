import api from './api';

export const logService = {
  toggleLog: async (habitId, date) => {
    const { data } = await api.post('/logs/toggle', { habitId, date });
    return data;
  },

  getLogsForDate: async (date) => {
    const { data } = await api.get(`/logs/date/${date || ''}`);
    return data.logs;
  },

  getWeeklyGrid: async (startDate) => {
    const { data } = await api.get('/logs/grid', { params: { startDate } });
    return data;
  },

  getHeatmap: async () => {
    const { data } = await api.get('/logs/heatmap');
    return data;
  },

  getHabitStats: async () => {
    const { data } = await api.get('/logs/stats');
    return data;
  },
};
