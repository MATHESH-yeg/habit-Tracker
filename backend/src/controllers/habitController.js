const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @desc    Get all active habits for current user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, archived: false }).sort({ position: 1, createdAt: 1 });
    res.json({ habits });
  } catch (error) {
    next(error);
  }
};

// @desc    Get archived habits for current user
// @route   GET /api/habits/archived
// @access  Private
const getArchivedHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, archived: true }).sort({ updatedAt: -1 });
    res.json({ habits });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { title, description, category, frequency, targetDays, color, icon } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    // Determine max position
    const maxHabit = await Habit.findOne({ userId: req.user._id, archived: false }).sort({ position: -1 });
    const nextPosition = maxHabit ? maxHabit.position + 1 : 0;

    const habit = await Habit.create({
      userId: req.user._id,
      title,
      description,
      category,
      frequency,
      targetDays,
      color,
      icon,
      position: nextPosition,
    });

    res.status(201).json({ habit });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit details
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const { title, description, category, frequency, targetDays, color, icon, archived } = req.body;

    if (title !== undefined) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (category !== undefined) habit.category = category;
    if (frequency !== undefined) habit.frequency = frequency;
    if (targetDays !== undefined) habit.targetDays = targetDays;
    if (color !== undefined) habit.color = color;
    if (icon !== undefined) habit.icon = icon;
    if (archived !== undefined) habit.archived = archived;

    const updatedHabit = await habit.save();
    res.json({ habit: updatedHabit });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit archive status
// @route   PATCH /api/habits/:id/archive
// @access  Private
const archiveHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    habit.archived = !habit.archived;
    await habit.save();

    res.json({ habit, message: habit.archived ? 'Habit archived' : 'Habit restored' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit and associated logs
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Delete associated logs if HabitLog model exists
    if (HabitLog) {
      await HabitLog.deleteMany({ habitId: req.params.id, userId: req.user._id });
    }

    res.json({ message: 'Habit and logs permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder habits position
// @route   PUT /api/habits/reorder
// @access  Private
const reorderHabits = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { id, position }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id, userId: req.user._id },
        update: { position: item.position },
      },
    }));

    await Habit.bulkWrite(bulkOps);

    const habits = await Habit.find({ userId: req.user._id, archived: false }).sort({ position: 1 });
    res.json({ habits });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  getArchivedHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  reorderHabits,
};
