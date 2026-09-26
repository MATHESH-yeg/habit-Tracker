import React, { useEffect, useState } from 'react';
import { Activity, Flame, Info } from 'lucide-react';
import { logService } from '../../services/logService';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export const Heatmap90Day = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [activeHabitsCount, setActiveHabitsCount] = useState(0);
  const [hoveredTile, setHoveredTile] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const data = await logService.getHeatmap();
        setHeatmapData(data.heatmap);
        setActiveHabitsCount(data.activeHabitsCount);
      } catch (err) {
        console.error('Failed to fetch heatmap:', err);
      }
    };
    fetchHeatmap();
  }, []);

  const getTileColor = (intensity) => {
    if (theme === 'dark') {
      switch (intensity) {
        case 4:
          return 'bg-amber-400 shadow-md shadow-amber-400/40 border-amber-300';
        case 3:
          return 'bg-amber-500 border-amber-400/60';
        case 2:
          return 'bg-amber-600/80 border-amber-500/40';
        case 1:
          return 'bg-amber-900/50 border-amber-700/30';
        default:
          return 'bg-slate-900/60 border-slate-800/80';
      }
    } else {
      switch (intensity) {
        case 4:
          return 'bg-amber-500 shadow-md shadow-amber-500/30 border-amber-600';
        case 3:
          return 'bg-amber-400 border-amber-500';
        case 2:
          return 'bg-amber-300 border-amber-400';
        case 1:
          return 'bg-amber-100 border-amber-200';
        default:
          return 'bg-slate-200/80 border-slate-300/80';
      }
    }
  };

  const totalCompletions90Days = heatmapData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">90-Day Consistency Heatmap</h2>
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="text-amber-600 dark:text-amber-400 font-extrabold">{totalCompletions90Days}</span> total check-offs in 90 days
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[640px]">
          {heatmapData.map((tile) => (
            <div
              key={tile.date}
              onMouseEnter={() => setHoveredTile(tile)}
              onMouseLeave={() => setHoveredTile(null)}
              className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 cursor-pointer relative ${getTileColor(
                tile.intensity
              )}`}
            />
          ))}
        </div>

        {/* Hover Tooltip */}
        {hoveredTile && (
          <div className="mt-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 inline-block shadow-lg">
            <span className="font-bold text-amber-600 dark:text-amber-400">{hoveredTile.date}:</span> {hoveredTile.count} completed routine(s)
          </div>
        )}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800/60">
        <span>Less Consistent</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-3.5 h-3.5 rounded-sm border ${getTileColor(0)}`} />
          <div className={`w-3.5 h-3.5 rounded-sm border ${getTileColor(1)}`} />
          <div className={`w-3.5 h-3.5 rounded-sm border ${getTileColor(2)}`} />
          <div className={`w-3.5 h-3.5 rounded-sm border ${getTileColor(3)}`} />
          <div className={`w-3.5 h-3.5 rounded-sm border ${getTileColor(4)}`} />
        </div>
        <span>More Consistent</span>
      </div>

    </div>
  );
};
