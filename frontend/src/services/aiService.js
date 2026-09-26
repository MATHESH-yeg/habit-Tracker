import api from './api';

export const aiService = {
  getMorningMotivation: async () => {
    const { data } = await api.get('/ai/morning-motivation');
    return data.message;
  },

  generateWeeklyReport: async () => {
    const { data } = await api.post('/ai/weekly-report');
    return data.report;
  },

  generateHabitSuggestions: async (goals, productiveTime, struggles) => {
    const { data } = await api.post('/ai/suggestions', { goals, productiveTime, struggles });
    return data.suggestions;
  },

  getStreakRecoveryPlan: async (habitId) => {
    const { data } = await api.post('/ai/streak-recovery', { habitId });
    return data;
  },

  chatHabitAnalysis: async (question) => {
    const { data } = await api.post('/ai/chat', { question });
    return data.answer;
  },
};
