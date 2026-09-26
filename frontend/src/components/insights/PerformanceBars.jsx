import React from 'react';
import { BarChart2, Flame, Award } from 'lucide-react';
import { GSAPReveal } from '../animation/GSAPReveal';
import { GSAPCountUp } from '../animation/GSAPCountUp';

export const PerformanceBars = ({ habitPerformance = [] }) => {
  const maxCompletions = Math.max(...habitPerformance.map((h) => h.completedCount || 0), 1);

  return (
    <GSAPReveal direction="up" delay={0.2}>
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Habit Performance Ranking</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">All-time check-offs</span>
        </div>

        <div className="space-y-4">
          {habitPerformance.map((habit) => {
            const pct = Math.round(((habit.completedCount || 0) / maxCompletions) * 100);

            return (
              <div key={habit.habitId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: habit.color || '#fa8c16' }}
                    />
                    {habit.title}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
                      {habit.currentStreak}d streak
                    </span>
                    •
                    <GSAPCountUp end={habit.completedCount || 0} suffix=" checks" />
                  </span>
                </div>

                {/* Animated Growing Bar */}
                <div className="h-3.5 w-full bg-slate-200/80 dark:bg-slate-900/80 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: habit.color || '#fa8c16',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </GSAPReveal>
  );
};
