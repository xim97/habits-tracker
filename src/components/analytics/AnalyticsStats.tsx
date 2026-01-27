'use client';

import { useHabitsContext } from '@/context/HabitsContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export function AnalyticsStats() {
  // Subscribe to completions directly to ensure re-render on changes
  const { completions } = useHabitsContext();
  const { stats } = useAnalytics(30);

  // Using completions.length to ensure this component re-renders when completions change
  // void completions.length;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-all duration-300">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums transition-all duration-300">
            {stats.perfectDays}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Perfect days
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
            {stats.perfectDayPercentage}% last 30d
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-all duration-300">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums transition-all duration-300">
            {stats.averageCompletion}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Avg completion
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            Last 30 days
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-all duration-300">
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums transition-all duration-300">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Current streak
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            Perfect days
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-all duration-300">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 tabular-nums transition-all duration-300">
            {stats.longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Best streak
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">
            Your record
          </div>
        </div>
      </div>
    </div>
  );
}
