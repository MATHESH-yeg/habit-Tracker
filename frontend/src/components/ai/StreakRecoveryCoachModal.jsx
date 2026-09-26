import React, { useState, useEffect } from 'react';
import { Bot, X, ShieldAlert, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';

export const StreakRecoveryCoachModal = ({ isOpen, onClose, habitId }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async () => {
    if (!habitId) return;
    setLoading(true);
    try {
      const data = await aiService.getStreakRecoveryPlan(habitId);
      setPlanData(data);
    } catch (err) {
      console.error('Failed to get streak recovery plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && habitId) {
      fetchPlan();
    } else {
      setPlanData(null);
    }
  }, [isOpen, habitId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Bot className="w-6 h-6" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Streak Recovery Coach</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Formulating 3-day momentum comeback plan...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-700 dark:text-amber-300">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-xs font-semibold">
                    Streak paused for <span className="underline font-bold">{planData?.habitTitle}</span>. Here is your personalized 3-day recovery roadmap!
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto">
                  {planData?.plan}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={fetchPlan}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate Plan</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                  >
                    Accept Comeback Challenge
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
