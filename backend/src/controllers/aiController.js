const { getGeminiClient } = require('../config/gemini');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { calculateStreaks, formatDateString, getPastNDays } = require('../utils/dateUtils');
const {
  buildMorningMotivationPrompt,
  buildWeeklyReportPrompt,
  buildHabitSuggestionsPrompt,
  buildStreakRecoveryPrompt,
  buildHabitChatPrompt,
} = require('../utils/geminiPrompts');

// Helper to call Gemini model
const callGemini = async (prompt, systemInstruction = '') => {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API call error:', error.message);
    return null;
  }
};

// @desc    Get AI Morning Motivation banner message
// @route   GET /api/ai/morning-motivation
// @access  Private
const getMorningMotivation = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const allLogs = await HabitLog.find({ userId: req.user._id, completed: true });

    const habitsWithStreaks = habits.map((h) => {
      const hLogs = allLogs.filter((l) => l.habitId.toString() === h._id.toString());
      const dates = hLogs.map((l) => l.date);
      const { currentStreak } = calculateStreaks(dates);
      return {
        title: h.title,
        category: h.category,
        currentStreak,
      };
    });

    const prompt = buildMorningMotivationPrompt(req.user.name, habitsWithStreaks);
    const aiResponse = await callGemini(prompt);

    const motivationMessage =
      aiResponse ||
      `Good morning, ${req.user.name}! Take a moment today to focus on your routines. Every check-off brings you closer to your long-term goals!`;

    res.json({ message: motivationMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Weekly Performance Report
// @route   POST /api/ai/weekly-report
// @access  Private
const generateWeeklyReport = async (req, res, next) => {
  try {
    const past7Days = getPastNDays(7);
    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const logs = await HabitLog.find({ userId: req.user._id, date: { $in: past7Days }, completed: true });

    const habitData7Days = habits.map((h) => {
      const hLogs = logs.filter((l) => l.habitId.toString() === h._id.toString());
      return {
        title: h.title,
        category: h.category,
        completionsLast7Days: hLogs.length,
        completionRate: `${Math.round((hLogs.length / 7) * 100)}%`,
      };
    });

    const prompt = buildWeeklyReportPrompt(req.user.name, habitData7Days);
    const reportText = await callGemini(prompt);

    const fallbackReport = `## Weekly Performance Review for ${req.user.name}\n\n**Overall Rating:** 8.0/10\n\nYou completed ${logs.length} habit check-offs across ${habits.length} active habits over the past 7 days. Consistency remains strong in your primary daily routines!`;

    res.json({ report: reportText || fallbackReport });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Habit Suggestions (3-step wizard)
// @route   POST /api/ai/suggestions
// @access  Private
const generateHabitSuggestions = async (req, res, next) => {
  try {
    const { goals, productiveTime, struggles } = req.body;

    const prompt = buildHabitSuggestionsPrompt(goals || 'Improve health', productiveTime || 'Morning', struggles || 'Consistency');
    const aiResponse = await callGemini(prompt);

    let suggestions = [];
    if (aiResponse) {
      try {
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse AI JSON response:', e);
      }
    }

    if (!suggestions || suggestions.length === 0) {
      suggestions = [
        {
          title: 'Morning Hydration & Stretches',
          category: 'Health',
          description: 'Drink 500ml water and perform 5 minutes of light stretching immediately after waking up.',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          icon: 'Flame',
        },
        {
          title: '25-Minute Focus Deep Work',
          category: 'Productivity',
          description: 'Complete 1 Pomodoro session on your highest priority goal with notifications muted.',
          targetDays: [1, 2, 3, 4, 5],
          icon: 'Zap',
        },
        {
          title: 'Evening Mindfulness Reflection',
          category: 'Mindfulness',
          description: 'Write down 3 quick wins and 1 gratitude note before sleep.',
          targetDays: [0, 1, 2, 3, 4, 5, 6],
          icon: 'BookOpen',
        },
      ];
    }

    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI Streak Recovery Coach Comeback Plan
// @route   POST /api/ai/streak-recovery
// @access  Private
const getStreakRecoveryPlan = async (req, res, next) => {
  try {
    const { habitId } = req.body;

    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const prompt = buildStreakRecoveryPrompt(req.user.name, habit.title, 7);
    const planText = await callGemini(prompt);

    const fallbackPlan = `### 3-Day Comeback Plan for "${habit.title}"\n\n- **Day 1 (Micro-Action):** Spend just 2 minutes restarting the habit today. No pressure for perfection.\n- **Day 2 (Standard Routine):** Resume your full target routine at your usual scheduled time.\n- **Day 3 (Reinforcement):** Celebrate completing 2 days in a row!`;

    res.json({ habitTitle: habit.title, plan: planText || fallbackPlan });
  } catch (error) {
    next(error);
  }
};

// @desc    Natural language AI Habit Analysis Chat
// @route   POST /api/ai/chat
// @access  Private
const chatHabitAnalysis = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question prompt is required' });
    }

    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const logs = await HabitLog.find({ userId: req.user._id, completed: true }).limit(200);

    const userContext = {
      user: req.user.name,
      activeHabitCount: habits.length,
      habits: habits.map((h) => ({ title: h.title, category: h.category })),
      totalCheckoffs: logs.length,
    };

    const prompt = buildHabitChatPrompt(req.user.name, userContext, question);
    const answer = await callGemini(prompt);

    const fallbackAnswer = `Based on your habit tracking log, you currently have ${habits.length} active habits and ${logs.length} total completed check-offs recorded! Keep staying consistent!`;

    res.json({ answer: answer || fallbackAnswer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMorningMotivation,
  generateWeeklyReport,
  generateHabitSuggestions,
  getStreakRecoveryPlan,
  chatHabitAnalysis,
};
