import React, { useState } from 'react';
import { Wand2, X, ArrowRight, ArrowLeft, Plus, Loader2, Sparkles, Check } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { habitService } from '../../services/habitService';
import { motion, AnimatePresence } from 'framer-motion';

export const HabitSuggestionWizard = ({ isOpen, onClose, onHabitAdded }) => {
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState('');
  const [productiveTime, setProductiveTime] = useState('Morning');
  const [struggles, setStruggles] = useState('');

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [importedIndices, setImportedIndices] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    setStep(4);
    try {
      const results = await aiService.generateHabitSuggestions(goals, productiveTime, struggles);
      setSuggestions(results);
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportHabit = async (suggestion, index) => {
    try {
      await habitService.createHabit({
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category || 'Productivity',
        color: '#fa8c16',
        icon: suggestion.icon || 'Flame',
      });
      setImportedIndices((prev) => [...prev, index]);
      if (onHabitAdded) onHabitAdded();
    } catch (err) {
      console.error('Failed to import habit:', err);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setGoals('');
    setProductiveTime('Morning');
    setStruggles('');
    setSuggestions([]);
    setImportedIndices([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              resetWizard();
              onClose();
            }}
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
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Habit Architect Wizard</h2>
              </div>
              <button
                onClick={() => {
                  resetWizard();
                  onClose();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            {step <= 3 && (
              <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                        step === num
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                          : step > num
                          ? 'bg-slate-200 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-800'
                      }`}
                    >
                      {num}
                    </div>
                    {num < 3 && <div className="w-12 sm:w-16 h-0.5 bg-slate-300 dark:bg-slate-800" />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Goals */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Step 1: Primary Life & Routine Goals</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">What areas do you want to elevate over the next 90 days?</p>
                <textarea
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Build better sleep hygiene, double focus hours on work, stay hydrated"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 focus:border-amber-500/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!goals.trim()}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>Next: Productive Hours</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Productive Time */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Step 2: Most Productive Time of Day</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">When do you feel most focused and ready to take action?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Morning (6AM - 12PM)', 'Afternoon (12PM - 5PM)', 'Evening (5PM - 9PM)', 'Night (9PM - 12AM)'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setProductiveTime(time)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                        productiveTime === time
                          ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                  >
                    <span>Next: Past Struggles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Past Struggles */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Step 3: Past Obstacles & Friction</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">What usually causes you to break streaks or give up?</p>
                <textarea
                  rows={3}
                  value={struggles}
                  onChange={(e) => setStruggles(e.target.value)}
                  placeholder="e.g. Setting goals too ambitious, forgetting in busy afternoons, lack of motivation"
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 focus:border-amber-500/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Habits</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: AI Results */}
            {step === 4 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gemini is constructing your habit blueprint...</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Recommended AI Habits</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {suggestions.map((item, index) => {
                        const isImported = importedIndices.includes(index);
                        return (
                          <div
                            key={index}
                            className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                            </div>

                            <button
                              onClick={() => handleImportHabit(item, index)}
                              disabled={isImported}
                              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                                isImported
                                  ? 'bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                              }`}
                            >
                              {isImported ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => {
                          resetWizard();
                          onClose();
                        }}
                        className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
