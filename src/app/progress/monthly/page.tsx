'use client';

import { useState, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, getDay, isSameDay, isSameMonth } from 'date-fns';
import { ProgressTabs } from '@/components/progress/ProgressTabs';
import { DateNavigator } from '@/components/progress/DateNavigator';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDateKey, formatMonthYear, getMonthDates, getHabitsForDate } from '@/lib/dates';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MonthlyProgressPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, completions, isHydrated } = useHabitsContext();

  const today = new Date();
  const monthDates = useMemo(() => getMonthDates(currentMonth), [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    const day = getDay(startOfMonth(currentMonth));
    return day === 0 ? 6 : day - 1; // Convert to Monday-start week
  }, [currentMonth]);

  const getDayCompletion = (date: Date) => {
    const dateKey = formatDateKey(date);
    const habitsForDay = getHabitsForDate(habits, date);
    if (habitsForDay.length === 0) return null;

    const completedCount = habitsForDay.filter(h =>
      completions.some(c => c.habitId === h.id && c.date === dateKey)
    ).length;

    return completedCount / habitsForDay.length;
  };

  const getCompletionColor = (completion: number | null) => {
    if (completion === null) return 'bg-gray-50 dark:bg-gray-900';
    if (completion === 1) return 'bg-emerald-500';
    if (completion >= 0.75) return 'bg-emerald-400';
    if (completion >= 0.5) return 'bg-emerald-300';
    if (completion >= 0.25) return 'bg-amber-300';
    if (completion > 0) return 'bg-amber-400';
    return 'bg-red-400';
  };

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressTabs />

      <DateNavigator
        label={formatMonthYear(currentMonth)}
        onPrevious={() => setCurrentMonth(d => subMonths(d, 1))}
        onNext={() => setCurrentMonth(d => addMonths(d, 1))}
        onToday={() => setCurrentMonth(new Date())}
      />

      {/* Calendar grid */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Month days */}
          {monthDates.map((date) => {
            const completion = getDayCompletion(date);
            const isToday = isSameDay(date, today);
            const isCurrentMonth = isSameMonth(date, currentMonth);

            return (
              <div
                key={date.toISOString()}
                className={`aspect-square p-1 ${!isCurrentMonth ? 'opacity-30' : ''}`}
              >
                <div
                  className={`w-full h-full rounded-lg flex items-center justify-center text-sm font-medium ${
                    getCompletionColor(completion)
                  } ${
                    completion !== null && completion > 0 ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  } ${
                    isToday ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-gray-900' : ''
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-emerald-300" />
          <span>50-99%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-amber-300" />
          <span>1-49%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-400" />
          <span>0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          <span>No habits</span>
        </div>
      </div>
    </div>
  );
}
