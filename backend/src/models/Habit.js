const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Health', 'Productivity', 'Mindfulness', 'Fitness', 'Learning', 'Finance', 'Custom'],
      default: 'Productivity',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    targetDays: {
      type: [Number], // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    color: {
      type: String,
      default: '#fa8c16', // Amber accent
    },
    icon: {
      type: String,
      default: 'Flame',
    },
    position: {
      type: Number,
      default: 0,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);
