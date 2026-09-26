import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar, Flame } from 'lucide-react';
import { logService } from '../../services/logService';
import { motion } from 'framer-motion';

export const WeeklyGrid = ({ habits = [], onToggleHabit }) => {
  const [currentBaseDate, setCurrentBaseDate] = useState(new Date());
  const [gridData, setGridData] = useState({ days: [], grid: {} });
  const [loading, setLoading] = useState(true);

  const fetchGrid = async () => {
    setLoading(true);
    try {
      const formattedDate = currentBaseDate.toISOString().split('T')[0];
      const data = await logService.getWeeklyGrid(formattedDate);
      setGridData(data);
    } catch (err) {
      console.error('Failed to fetch weekly grid data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrid();
  }, [currentBaseDate, habits]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentBaseDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentBaseDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentBaseDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentBaseDate(newDate);
  };

  const handleToggleCell = async (habitId, dateStr) => {
    await logService.toggleLog(habitId, dateStr);
    fetchGrid();
    if (onToggleHabit) onToggleHabit();
  };

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return { dayName, dayNum };
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">7-Day Weekly Grid</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-xl glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-amber-500/40 transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentBaseDate(new Date())}
            className="px-3 py-1 rounded-xl glass-pill text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-xl glass-pill text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-amber-500/40 transition-colors"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="pb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[160px]">
                Habit Routine
              </th>
              {gridData.days.map((dateStr) => {
                const { dayName, dayNum } = formatDateHeader(dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                return (
                  <th key={dateStr} className="pb-3 text-center min-w-[54px]">
                    <div className={`text-[11px] font-bold uppercase tracking-wider ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {dayName}
                    </div>
                    <div className={`text-sm font-extrabold mt-0.5 ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {dayNum}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/60">
            {habits.map((habit) => (
              <tr key={habit._id} className="group hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 pr-4 font-semibold text-sm text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color || '#fa8c16' }}
                    />
                    <span className="truncate">{habit.title}</span>
                  </div>
                </td>
                {gridData.days.map((dateStr) => {
                  const key = `${habit._id}_${dateStr}`;
                  const isChecked = !!gridData.grid[key];

                  return (
                    <td key={dateStr} className="py-3.5 text-center">
                      <button
                        onClick={() => handleToggleCell(habit._id, dateStr)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all ${
                          isChecked
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                            : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400 border border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="w-5 h-5 stroke-[3]" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
