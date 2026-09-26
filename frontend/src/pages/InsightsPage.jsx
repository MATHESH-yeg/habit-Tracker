import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Wand2, RefreshCw, Sparkles, PieChart, BarChart2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { logService } from '../services/logService';
import { GSAPReveal } from '../components/animation/GSAPReveal';
import { CategoryDonut } from '../components/insights/CategoryDonut';
import { PerformanceBars } from '../components/insights/PerformanceBars';
import { HabitSuggestionWizard } from '../components/ai/HabitSuggestionWizard';
import { FloatingAIChatWidget } from '../components/stats/FloatingAIChatWidget';

export const InsightsPage = () => {
  const [report, setReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(true);
  const [habitPerformance, setHabitPerformance] = useState([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchWeeklyReport = async () => {
    setLoadingReport(true);
    try {
      const rep = await aiService.generateWeeklyReport();
      setReport(rep);
    } catch (err) {
      console.error('Failed to generate AI weekly report:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await logService.getHabitStats();
      setHabitPerformance(stats.habitPerformance || []);
    } catch (err) {
      console.error('Failed to fetch habit stats:', err);
    }
  };

  useEffect(() => {
    fetchWeeklyReport();
    fetchStats();
  }, []);

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
            <Bot className="w-4 h-4" />
            <span>Gemini Intelligence Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">AI Habit Insights & Analytics</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Deep performance reviews powered by Google Gemini AI, category breakdowns, and habit suggestion wizards.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Wand2 className="w-4 h-4" />
          <span>AI Habit Architect Wizard</span>
        </button>
      </motion.div>

      {/* AI Weekly Report Card */}
      <GSAPReveal direction="up" delay={0.1}>
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI 7-Day Performance Review</h2>
            </div>
            <button
              onClick={fetchWeeklyReport}
              disabled={loadingReport}
              className="p-2 rounded-xl glass-pill text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors disabled:opacity-50"
              title="Regenerate Report"
            >
              <RefreshCw className={`w-4 h-4 ${loadingReport ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingReport ? (
            <div className="space-y-3 py-6">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-5/6" />
            </div>
          ) : (
            <div className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white/60 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              {report}
            </div>
          )}
        </div>
      </GSAPReveal>

      {/* Grid: Category Donut & Performance Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CategoryDonut habitPerformance={habitPerformance} />
        <PerformanceBars habitPerformance={habitPerformance} />
      </div>

      {/* Wizard Modal */}
      <HabitSuggestionWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onHabitAdded={fetchStats}
      />

      {/* Floating AI Chat Widget */}
      <FloatingAIChatWidget />

    </div>
  );
};
