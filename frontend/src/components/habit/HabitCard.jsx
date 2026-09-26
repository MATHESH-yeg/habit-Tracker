import React from 'react';
import { Flame, Check, MoreVertical, Archive, Trash2, Edit2, Zap, Heart, BookOpen, Activity, Shield } from 'lucide-react';
import { SpringProgressRing } from '../animation/SpringProgressRing';
import { triggerConfetti } from '../animation/ConfettiTrigger';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';

const iconMap = {
  Flame,
  Zap,
  BookOpen,
  Heart,
  Activity,
  Shield,
};

export const HabitCard = ({
  habit,
  isCompleted = false,
  currentStreak = 0,
  onToggle,
  onEdit,
  onArchive,
  onDelete,
  onOpenRecoveryCoach,
}) => {
  const IconComponent = iconMap[habit.icon] || Flame;

  // React Spring animation for streak badge count bump
  const streakSpring = useSpring({
    transform: isCompleted ? 'scale(1.15)' : 'scale(1)',
    config: { tension: 300, friction: 12 },
  });

  const handleCheckoffClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    if (!isCompleted) {
      triggerConfetti(x, y);
    }
    onToggle(habit._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`glass-card p-5 rounded-3xl border transition-all group relative overflow-hidden ${
        isCompleted
          ? 'border-amber-500/30 bg-amber-500/5 dark:bg-slate-900/80'
          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      {/* Accent Top Border Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: habit.color || '#fa8c16' }}
      />

      <div className="flex items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Habit Icon Container */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${habit.color}15`,
              borderColor: `${habit.color}40`,
              color: habit.color,
            }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`font-bold text-base tracking-tight truncate ${
                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {habit.title}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700/60">
                {habit.category}
              </span>
            </div>

            {habit.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{habit.description}</p>
            )}

            {/* Streak Indicator */}
            <div className="flex items-center gap-2 mt-2">
              <animated.div
                style={streakSpring}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
                <span>{currentStreak} day streak</span>
              </animated.div>

              {/* Broken Streak AI Coach Alert button */}
              {currentStreak === 0 && onOpenRecoveryCoach && (
                <button
                  onClick={() => onOpenRecoveryCoach(habit._id)}
                  className="text-[11px] font-semibold text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 underline decoration-amber-500/40"
                >
                  AI Comeback Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Button with React Spring Progress Ring */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckoffClick}
            aria-label={`Mark habit ${habit.title} as ${isCompleted ? 'incomplete' : 'completed'}`}
            className="group/btn focus:outline-none"
          >
            <SpringProgressRing
              size={46}
              strokeWidth={3.5}
              progress={isCompleted ? 1 : 0}
              color={habit.color || '#fa8c16'}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-800'
                }`}
              >
                <Check className={`w-5 h-5 ${isCompleted ? 'stroke-[3]' : ''}`} />
              </div>
            </SpringProgressRing>
          </button>

          {/* Action Menu Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(habit)}
              title="Edit habit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onArchive(habit._id)}
              title="Archive habit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(habit._id)}
              title="Delete habit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
