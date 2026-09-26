import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Sparkles, CheckCircle2, LayoutGrid, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { habitService } from '../services/habitService';
import { logService } from '../services/logService';

import { MorningMotivationBanner } from '../components/ai/MorningMotivationBanner';
import { HabitCard } from '../components/habit/HabitCard';
import { HabitFormModal } from '../components/habit/HabitFormModal';
import { WeeklyGrid } from '../components/grid/WeeklyGrid';
import { Heatmap90Day } from '../components/heatmap/Heatmap90Day';
import { StreakRecoveryCoachModal } from '../components/ai/StreakRecoveryCoachModal';
import { FloatingAIChatWidget } from '../components/stats/FloatingAIChatWidget';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ activeStreaks: 0, bestStreak: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);

  const [recoveryHabitId, setRecoveryHabitId] = useState(null);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [fetchedHabits, todayLogs, overallStats] = await Promise.all([
        habitService.getHabits(),
        logService.getLogsForDate(),
        logService.getHabitStats(),
      ]);

      setHabits(fetchedHabits);
      setLogs(todayLogs);
      setStats({
        activeStreaks: overallStats.activeStreaks || 0,
        bestStreak: overallStats.bestStreak || 0,
        habitPerformance: overallStats.habitPerformance || [],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleHabit = async (habitId) => {
    try {
      await logService.toggleLog(habitId);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle habit log:', err);
    }
  };

  const handleCreateOrUpdateHabit = async (habitData) => {
    if (habitToEdit) {
      await habitService.updateHabit(habitToEdit._id, habitData);
    } else {
      await habitService.createHabit(habitData);
    }
    fetchData();
  };

  const handleArchiveHabit = async (habitId) => {
    await habitService.archiveHabit(habitId);
    fetchData();
  };

  const handleDeleteHabit = async (habitId) => {
    await habitService.deleteHabit(habitId);
    fetchData();
  };

  const handleOpenRecoveryCoach = (habitId) => {
    setRecoveryHabitId(habitId);
    setIsRecoveryOpen(true);
  };

  const completedMap = {};
  logs.forEach((log) => {
    if (log.completed) completedMap[log.habitId] = true;
  });

  const streakMap = {};
  if (stats.habitPerformance) {
    stats.habitPerformance.forEach((hp) => {
      streakMap[hp.habitId] = hp.currentStreak;
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Habit Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Habit Builder'}! 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track today's routines, review your streaks, and keep your consistency momentum high.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeStreaks} Active</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Active Habit Streaks</div>
          </div>
        </div>
      </motion.div>

      {/* AI Morning Motivation Banner */}
      <MorningMotivationBanner />

      {/* Main Grid: Left Habit List, Right Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Habit Cards Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Today's Habits & Routines</h2>
            </div>
            <button
              onClick={() => {
                setHabitToEdit(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>New Habit</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 glass-card rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Active Habits Yet</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Create your first habit or use the AI Habit Architect Wizard to generate custom routines.
              </p>
              <button
                onClick={() => {
                  setHabitToEdit(null);
                  setIsFormOpen(true);
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Habit</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  isCompleted={!!completedMap[habit._id]}
                  currentStreak={streakMap[habit._id] || 0}
                  onToggle={handleToggleHabit}
                  onEdit={(h) => {
                    setHabitToEdit(h);
                    setIsFormOpen(true);
                  }}
                  onArchive={handleArchiveHabit}
                  onDelete={handleDeleteHabit}
                  onOpenRecoveryCoach={handleOpenRecoveryCoach}
                />
              ))}
            </div>
          )}

          {/* 7-Day Weekly Grid View */}
          <WeeklyGrid habits={habits} onToggleHabit={fetchData} />
        </div>

        {/* Right Sidebar: 90-Day Heatmap */}
        <div className="space-y-6">
          <Heatmap90Day />
        </div>

      </div>

      {/* Habit Create / Edit Modal */}
      <HabitFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdateHabit}
        habitToEdit={habitToEdit}
      />

      {/* AI Streak Recovery Coach Modal */}
      <StreakRecoveryCoachModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        habitId={recoveryHabitId}
      />

      {/* Floating AI Chat Widget */}
      <FloatingAIChatWidget />

    </div>
  );
};
