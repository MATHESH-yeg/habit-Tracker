import React, { useState, useEffect } from 'react';
import { X, Flame, Zap, BookOpen, Heart, Activity, Shield, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Health', 'Productivity', 'Mindfulness', 'Fitness', 'Learning', 'Finance'];

const colorOptions = [
  '#fa8c16', // Amber
  '#eab308', // Yellow
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const icons = [
  { name: 'Flame', component: Flame },
  { name: 'Zap', component: Zap },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Heart', component: Heart },
  { name: 'Activity', component: Activity },
  { name: 'Shield', component: Shield },
];

export const HabitFormModal = ({ isOpen, onClose, onSubmit, habitToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [color, setColor] = useState('#fa8c16');
  const [icon, setIcon] = useState('Flame');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title || '');
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category || 'Productivity');
      setColor(habitToEdit.color || '#fa8c16');
      setIcon(habitToEdit.icon || 'Flame');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Productivity');
      setColor('#fa8c16');
      setIcon('Flame');
    }
  }, [habitToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        category,
        color,
        icon,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit habit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-lg glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Habit Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Read 15 pages, Drink 2L water"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 focus:border-amber-500/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Description / Goal Rationale
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this habit important to your daily routine?"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 focus:border-amber-500/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        category === cat
                          ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color & Icon Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Icon
                  </label>
                  <div className="flex items-center gap-2">
                    {icons.map(({ name: iconName, component: Icon }) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setIcon(iconName)}
                        className={`p-2 rounded-xl border transition-all ${
                          icon === iconName
                            ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-900/40 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{habitToEdit ? 'Save Changes' : 'Create Habit'}</span>
                  )}
                </button>
              </div>

            </form>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
