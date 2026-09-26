const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const { formatDateString, calculateStreaks, getPastNDays } = require('../utils/dateUtils');

// @desc    Toggle habit completion status for a date (one-click)
// @route   POST /api/logs/toggle
// @access  Private
const toggleLog = async (req, res, next) => {
  try {
    const { habitId, date = formatDateString(new Date()) } = req.body;

    if (!habitId) {
      return res.status(400).json({ message: 'Habit ID is required' });
    }

    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    let log = await HabitLog.findOne({ habitId, userId: req.user._id, date });

    if (log) {
      log.completed = !log.completed;
      await log.save();
    } else {
      log = await HabitLog.create({
        habitId,
        userId: req.user._id,
        date,
        completed: true,
      });
    }

    // Recalculate streaks for this habit
    const allCompletedLogs = await HabitLog.find({
      habitId,
      userId: req.user._id,
      completed: true,
    }).select('date');

    const completedDates = allCompletedLogs.map((l) => l.date);
    const { currentStreak, longestStreak } = calculateStreaks(completedDates);

    res.json({
      log,
      currentStreak,
      longestStreak,
      message: log.completed ? 'Habit completed!' : 'Habit uncompleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logs for a specific date
// @route   GET /api/logs/date/:date
// @access  Private
const getLogsForDate = async (req, res, next) => {
  try {
    const dateStr = req.params.date || formatDateString(new Date());

    const logs = await HabitLog.find({ userId: req.user._id, date: dateStr });
    res.json({ date: dateStr, logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 7-day weekly grid logs for active habits
// @route   GET /api/logs/grid
// @access  Private
const getWeeklyGrid = async (req, res, next) => {
  try {
    const { startDate } = req.query;

    const habits = await Habit.find({ userId: req.user._id, archived: false }).sort({ position: 1 });

    // Generate 7 days starting from startDate (or 6 days prior to today)
    const baseDate = startDate ? new Date(startDate) : new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - (6 - i));
      days.push(formatDateString(d));
    }

    const logs = await HabitLog.find({
      userId: req.user._id,
      date: { $in: days },
      completed: true,
    });

    // Create a map of habitId_date -> boolean
    const logMap = {};
    logs.forEach((log) => {
      logMap[`${log.habitId}_${log.date}`] = true;
    });

    res.json({
      days,
      habits,
      grid: logMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 90-day heatmap data
// @route   GET /api/logs/heatmap
// @access  Private
const getHeatmap = async (req, res, next) => {
  try {
    const past90Days = getPastNDays(90);

    const logs = await HabitLog.find({
      userId: req.user._id,
      date: { $in: past90Days },
      completed: true,
    });

    const activeHabitsCount = await Habit.countDocuments({ userId: req.user._id, archived: false });

    // Count completions per date
    const dateCounts = {};
    past90Days.forEach((date) => {
      dateCounts[date] = 0;
    });

    logs.forEach((log) => {
      if (dateCounts[log.date] !== undefined) {
        dateCounts[log.date] += 1;
      }
    });

    // Format array with intensity scale 0-4
    const heatmap = past90Days.map((date) => {
      const count = dateCounts[date] || 0;
      let intensity = 0;

      if (count > 0 && activeHabitsCount > 0) {
        const ratio = count / Math.max(activeHabitsCount, 1);
        if (ratio >= 0.8) intensity = 4;
        else if (ratio >= 0.5) intensity = 3;
        else if (ratio >= 0.25) intensity = 2;
        else intensity = 1;
      } else if (count > 0) {
        intensity = 1;
      }

      return {
        date,
        count,
        intensity,
      };
    });

    res.json({ heatmap, activeHabitsCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive stats (streaks, performance metrics)
// @route   GET /api/logs/stats
// @access  Private
const getHabitStats = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, archived: false });
    const allLogs = await HabitLog.find({ userId: req.user._id, completed: true });

    // Calculate streaks per habit
    let totalCheckoffs = allLogs.length;
    let maxOverallStreak = 0;
    let totalActiveStreaks = 0;

    const habitPerformance = [];

    for (const habit of habits) {
      const habitLogs = allLogs.filter((l) => l.habitId.toString() === habit._id.toString());
      const completedDates = habitLogs.map((l) => l.date);
      const { currentStreak, longestStreak } = calculateStreaks(completedDates);

      if (longestStreak > maxOverallStreak) {
        maxOverallStreak = longestStreak;
      }
      if (currentStreak > 0) {
        totalActiveStreaks += 1;
      }

      habitPerformance.push({
        habitId: habit._id,
        title: habit.title,
        category: habit.category,
        color: habit.color,
        icon: habit.icon,
        completedCount: completedDates.length,
        currentStreak,
        longestStreak,
      });
    }

    res.json({
      totalHabits: habits.length,
      totalCheckoffs,
      bestStreak: maxOverallStreak,
      activeStreaks: totalActiveStreaks,
      habitPerformance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleLog,
  getLogsForDate,
  getWeeklyGrid,
  getHeatmap,
  getHabitStats,
};
