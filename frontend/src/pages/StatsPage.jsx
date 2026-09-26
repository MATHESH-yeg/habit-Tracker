import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { logService } from '../services/logService';
import { GSAPReveal } from '../components/animation/GSAPReveal';
import { GSAPCountUp } from '../components/animation/GSAPCountUp';
import { PerformanceBars } from '../components/insights/PerformanceBars';
import { FloatingAIChatWidget } from '../components/stats/FloatingAIChatWidget';

export const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await logService.getHabitStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>All-Time Performance Metrics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Habit Statistics & Milestones</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore your all-time longest streaks, total check-offs, and routine performance rankings.
        </p>
      </motion.div>

      {/* Top GSAP Scroll-Revealed Stat Cards with Count-Up */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <GSAPReveal direction="up" delay={0.1}>
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                <GSAPCountUp end={stats?.bestStreak || 0} suffix=" Days" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                All-Time Longest Streak
              </div>
            </div>
          </div>
        </GSAPReveal>

        <GSAPReveal direction="up" delay={0.2}>
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                <GSAPCountUp end={stats?.totalCheckoffs || 0} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Total Completed Check-offs
              </div>
            </div>
          </div>
        </GSAPReveal>

        <GSAPReveal direction="up" delay={0.3}>
          <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Flame className="w-6 h-6 fill-amber-500 dark:fill-amber-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                <GSAPCountUp end={stats?.activeStreaks || 0} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Currently Active Streaks
              </div>
            </div>
          </div>
        </GSAPReveal>

      </div>

      {/* Habit Performance Bars Section */}
      <PerformanceBars habitPerformance={stats?.habitPerformance || []} />

      {/* Floating AI Chat Widget */}
      <FloatingAIChatWidget />

    </div>
  );
};
