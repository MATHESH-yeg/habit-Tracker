import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { GSAPReveal } from '../animation/GSAPReveal';

const categoryColors = {
  Health: '#fa8c16',
  Productivity: '#eab308',
  Learning: '#3b82f6',
  Mindfulness: '#a855f7',
  Fitness: '#10b981',
  Finance: '#ec4899',
  Custom: '#64748b',
};

export const CategoryDonut = ({ habitPerformance = [] }) => {
  // Aggregate counts per category
  const categoryCounts = {};
  let totalCompletions = 0;

  habitPerformance.forEach((h) => {
    const cat = h.category || 'Custom';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + (h.completedCount || 0);
    totalCompletions += h.completedCount || 0;
  });

  const categories = Object.keys(categoryCounts);

  return (
    <GSAPReveal direction="up" delay={0.1} className="h-full">
      <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 h-full flex flex-col justify-between">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Category Distribution</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {totalCompletions} Total Actions
          </span>
        </div>

        {/* Visual Progress Stack */}
        <div className="space-y-4">
          <div className="h-5 w-full bg-slate-200/80 dark:bg-slate-900/80 rounded-xl overflow-hidden flex border border-slate-300 dark:border-slate-800">
            {categories.map((cat) => {
              const count = categoryCounts[cat];
              const pct = totalCompletions > 0 ? (count / totalCompletions) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={cat}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: categoryColors[cat] || '#fa8c16',
                  }}
                  className="h-full transition-all hover:opacity-80"
                  title={`${cat}: ${Math.round(pct)}%`}
                />
              );
            })}
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {categories.map((cat) => {
              const count = categoryCounts[cat];
              const pct = totalCompletions > 0 ? Math.round((count / totalCompletions) * 100) : 0;
              return (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: categoryColors[cat] || '#fa8c16' }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </GSAPReveal>
  );
};
