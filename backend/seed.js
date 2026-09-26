const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Habit = require('./src/models/Habit');
const HabitLog = require('./src/models/HabitLog');
const { formatDateString } = require('./src/utils/dateUtils');

dotenv.config();

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing demo data
    await User.deleteMany({ email: 'demo@aurahabit.com' });
    const existingDemoUser = await User.findOne({ email: 'demo@aurahabit.com' });
    if (existingDemoUser) {
      await Habit.deleteMany({ userId: existingDemoUser._id });
      await HabitLog.deleteMany({ userId: existingDemoUser._id });
    }

    // Create Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@aurahabit.com',
      password: hashedPassword,
      theme: 'dark',
    });

    console.log(`👤 Created Demo User: ${demoUser.email} (password: password123)`);

    // Create Habits
    const habitsData = [
      {
        userId: demoUser._id,
        title: 'Morning Hydration & Stretches',
        description: 'Drink 500ml water and 5 minutes light stretching upon waking up.',
        category: 'Health',
        frequency: 'daily',
        color: '#fa8c16',
        icon: 'Flame',
        position: 0,
      },
      {
        userId: demoUser._id,
        title: '25-Min Deep Focus Block',
        description: 'Complete 1 Pomodoro session with zero digital distractions.',
        category: 'Productivity',
        frequency: 'daily',
        color: '#eab308',
        icon: 'Zap',
        position: 1,
      },
      {
        userId: demoUser._id,
        title: 'Read 15 Pages',
        description: 'Read non-fiction or educational book chapter.',
        category: 'Learning',
        frequency: 'daily',
        color: '#3b82f6',
        icon: 'BookOpen',
        position: 2,
      },
      {
        userId: demoUser._id,
        title: 'Evening Reflection & Gratitude',
        description: 'Journal 3 key accomplishments and gratitude notes.',
        category: 'Mindfulness',
        frequency: 'daily',
        color: '#a855f7',
        icon: 'Heart',
        position: 3,
      },
      {
        userId: demoUser._id,
        title: '30-Min Gym Workout',
        description: 'Cardio, weight training, or high-intensity interval training.',
        category: 'Fitness',
        frequency: 'daily',
        color: '#10b981',
        icon: 'Activity',
        position: 4,
      },
    ];

    const habits = await Habit.insertMany(habitsData);
    console.log(`✨ Created ${habits.length} Habits`);

    // Generate 90 Days of Logs
    const logs = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateString(d);

      habits.forEach((habit) => {
        let completionProbability = 0.8; // default 80%

        // Vary probability per habit type for realistic streak gaps
        if (habit.category === 'Health') completionProbability = 0.9;
        if (habit.category === 'Fitness') completionProbability = 0.55;
        if (habit.category === 'Mindfulness') completionProbability = 0.75;

        // Introduce a broken streak gap 8-14 days ago for Gym habit (to trigger AI streak coach)
        if (habit.title.includes('Gym') && i >= 8 && i <= 14) {
          completionProbability = 0.0;
        }

        if (Math.random() < completionProbability) {
          logs.push({
            habitId: habit._id,
            userId: demoUser._id,
            date: dateStr,
            completed: true,
          });
        }
      });
    }

    await HabitLog.insertMany(logs);
    console.log(`📊 Generated ${logs.length} historical completion logs spanning 90 days!`);

    console.log('✅ Demo Data Seed Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDemoData();
