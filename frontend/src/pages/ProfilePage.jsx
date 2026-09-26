import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', { name });
      updateUserProfile(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-4 h-4" />
          <span>User Profile Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Account Preferences</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your profile details and theme preferences.</p>
      </motion.div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 focus:border-amber-500/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Email Address (Read-Only)
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300/60 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Theme Selection</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Current theme: <span className="capitalize text-amber-600 dark:text-amber-400 font-semibold">{theme}</span></div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-300/80 dark:border-slate-700/60 transition-colors"
          >
            Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
