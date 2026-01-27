'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { addDays, subDays, isToday } from 'date-fns';
import { HabitCheckbox } from '@/components/habits/HabitCheckbox';
import { DashboardProgress } from '@/components/progress/DashboardProgress';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDisplayDate, formatDateKey, getHabitsForDate } from '@/lib/dates';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, isCompleted, toggleCompletion, isHydrated } = useHabitsContext();

  const dateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const habitsForDay = useMemo(() => getHabitsForDate(habits, selectedDate), [habits, selectedDate]);

  const completedCount = useMemo(() => {
    return habitsForDay.filter(habit => isCompleted(habit.id, dateKey)).length;
  }, [habitsForDay, isCompleted, dateKey]);

  const totalCount = habitsForDay.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  const isSelectedToday = isToday(selectedDate);

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Progress Dashboard & Analytics */}
      <div className="space-y-6">
        <DashboardProgress />
        <AnalyticsStats />
      </div>

      {/* Right: Day's Habits */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* Date navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(d => subDays(d, 1))}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Previous day"
              >
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatDisplayDate(selectedDate)}
                {isSelectedToday && (
                  <span className="ml-1.5 text-xs font-normal text-emerald-600 dark:text-emerald-400">(Today)</span>
                )}
              </p>
              <button
                onClick={() => setSelectedDate(d => addDays(d, 1))}
                disabled={isSelectedToday}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSelectedToday
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-label="Next day"
              >
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {!isSelectedToday && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="ml-1 px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Today
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalCount === 0 ? (
                'No habits'
              ) : (
                <>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums transition-all duration-300">{completedCount}</span>
                  <span className="text-gray-400 dark:text-gray-500"> / </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{totalCount}</span>
                  <span className="ml-1 text-gray-400 tabular-nums transition-all duration-300">({completionPercentage}%)</span>
                </>
              )}
            </p>
          </div>
          <div className="h-[6px] bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {habitsForDay.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {isSelectedToday ? "Today's Habits" : "Habits"}
            </h2>
            <div className="space-y-2">
              {habitsForDay.map((habit) => (
                <HabitCheckbox
                  key={habit.id}
                  habit={habit}
                  isCompleted={isCompleted(habit.id, dateKey)}
                  onToggle={() => toggleCompletion(habit.id, dateKey)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
              {habits.length === 0 ? 'No habits yet' : 'No habits scheduled'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {habits.length === 0 ? 'Create your first habit to get started' : 'No habits are scheduled for this day'}
            </p>
            {habits.length === 0 && (
              <Link
                href="/add-habit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add your first habit
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
