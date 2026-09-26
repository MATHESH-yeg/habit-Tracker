import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { motion } from 'framer-motion';

export const MorningMotivationBanner = () => {
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMotivation = async () => {
    setLoading(true);
    try {
      const msg = await aiService.getMorningMotivation();
      setMotivation(msg);
    } catch (err) {
      console.error('Failed to load morning motivation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivation();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 dark:via-slate-900/60 to-white/40 dark:to-slate-900/60 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300 mt-0.5">
            <Sparkles className="w-5 h-5 fill-amber-500/20 dark:fill-amber-300/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Gemini Morning Motivation
              </span>
            </div>
            {loading ? (
              <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800/80 animate-pulse rounded mt-2" />
            ) : (
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 leading-relaxed italic">
                "{motivation}"
              </p>
            )}
          </div>
        </div>

        <button
          onClick={fetchMotivation}
          disabled={loading}
          title="Refresh AI Motivation"
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </motion.div>
  );
};
