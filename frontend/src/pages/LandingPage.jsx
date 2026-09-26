import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Sparkles, Zap, Shield, Bot, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-16 text-center max-w-5xl mx-auto">
      
      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6"
      >
        <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        <span>Next-Gen Gemini AI Habit Tracking</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6"
      >
        Transform Your Daily Habits with <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 dark:from-amber-400 dark:via-amber-200 dark:to-yellow-400 bg-clip-text text-transparent">
          AI Intelligence & Physics Motion
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Track daily routines with 90-day heatmaps, dynamic physics feedback, and personalized Gemini AI streak recovery coaching.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-16"
      >
        <Link
          to="/register"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Start Free Today</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold text-slate-800 dark:text-slate-200 text-base border border-slate-300/80 dark:border-slate-700/60 flex items-center justify-center transition-all"
        >
          Existing Account
        </Link>
      </motion.div>

      {/* Feature Grid Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
      >
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 dark:text-amber-400">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gemini AI Coaching</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Personalized weekly reviews, habit recommendation wizard, and 3-day comeback plans for broken streaks.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 dark:text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">90-Day Amber Heatmap</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            GitHub-style activity visualization with theme-aware gradient intensity and full streak statistics.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500 dark:text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Physics Animation Stack</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Powered by Lenis, GSAP ScrollTrigger, Framer Motion, React Spring physics rings, and 3D R3F shaders.
          </p>
        </div>
      </motion.div>

    </div>
  );
};
