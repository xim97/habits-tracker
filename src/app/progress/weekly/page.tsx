'use client';

import { useState, useMemo } from 'react';
import { addWeeks, subWeeks, format, isSameDay } from 'date-fns';
import { ProgressTabs } from '@/components/progress/ProgressTabs';
import { DateNavigator } from '@/components/progress/DateNavigator';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDateKey, getWeekDates, getHabitsForDate, formatShortDate } from '@/lib/dates';

export default function WeeklyProgressPage() {
  const [weekStart, setWeekStart] = useState(new Date());
  const { habits, isCompleted, isHydrated } = useHabitsContext();

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const today = new Date();

  const weekLabel = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${formatShortDate(start)} - ${formatShortDate(end)}`;
  }, [weekDates]);

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
        label={weekLabel}
        onPrevious={() => setWeekStart(d => subWeeks(d, 1))}
        onNext={() => setWeekStart(d => addWeeks(d, 1))}
        onToday={() => setWeekStart(new Date())}
      />

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 py-2" />
            {weekDates.map((date) => (
              <div
                key={date.toISOString()}
                className={`text-center py-2 rounded-lg ${
                  isSameDay(date, today) ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
                }`}
              >
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {format(date, 'EEE')}
                </div>
                <div className={`text-sm font-semibold ${
                  isSameDay(date, today) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {format(date, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Habits grid */}
          {habits.length > 0 ? (
            <div className="space-y-1">
              {habits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-8 gap-1 items-center">
                  <div className="flex items-center gap-2 py-2 pr-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {habit.name}
                    </span>
                  </div>
                  {weekDates.map((date) => {
                    const dateKey = formatDateKey(date);
                    const isScheduled = getHabitsForDate([habit], date).length > 0;
                    const completed = isCompleted(habit.id, dateKey);

                    return (
                      <div key={date.toISOString()} className="flex justify-center py-2">
                        {isScheduled ? (
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              completed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}
                          >
                            {completed ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No habits to display
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
          <span>Not scheduled</span>
        </div>
      </div>
    </div>
  );
}
