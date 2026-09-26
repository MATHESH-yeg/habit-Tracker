import api from './api';

export const habitService = {
  getHabits: async () => {
    const { data } = await api.get('/habits');
    return data.habits;
  },

  getArchivedHabits: async () => {
    const { data } = await api.get('/habits/archived');
    return data.habits;
  },

  createHabit: async (habitData) => {
    const { data } = await api.post('/habits', habitData);
    return data.habit;
  },

  updateHabit: async (id, habitData) => {
    const { data } = await api.put(`/habits/${id}`, habitData);
    return data.habit;
  },

  archiveHabit: async (id) => {
    const { data } = await api.patch(`/habits/${id}/archive`);
    return data;
  },

  deleteHabit: async (id) => {
    const { data } = await api.delete(`/habits/${id}`);
    return data;
  },

  reorderHabits: async (items) => {
    const { data } = await api.put('/habits/reorder', { items });
    return data.habits;
  },
};
