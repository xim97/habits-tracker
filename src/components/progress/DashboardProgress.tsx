'use client';

import { useMemo } from 'react';
import { format, isSameDay, subDays } from 'date-fns';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDateKey, getWeekDates, getMonthDates, getHabitsForDate } from '@/lib/dates';

type ViewType = 'daily' | 'weekly' | 'monthly';

interface DashboardProgressProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function DashboardProgress({ selectedDate, onDateSelect }: DashboardProgressProps) {
  const [view, setView] = useLocalStorage<ViewType>('habits-tracker:progress-view', 'weekly');
  const { habits, completions } = useHabitsContext();

  const today = new Date();

  const getDayCompletion = (date: Date) => {
    const dateKey = formatDateKey(date);
    const habitsForDay = getHabitsForDate(habits, date);
    if (habitsForDay.length === 0) return null;

    const completedCount = habitsForDay.filter(h =>
      completions.some(c => c.habitId === h.id && c.date === dateKey)
    ).length;

    return completedCount / habitsForDay.length;
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const weekDates = useMemo(() => getWeekDates(today), []);
  const monthDates = useMemo(() => getMonthDates(today), []);
  const last7Days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i)),
  []);

  const getCompletionColor = (completion: number | null) => {
    if (completion === null) return 'bg-gray-100 dark:bg-gray-800';
    if (completion === 1) return 'bg-emerald-500';
    if (completion >= 0.5) return 'bg-emerald-300';
    if (completion > 0) return 'bg-amber-300';
    return 'bg-red-300';
  };

  const isSelected = (date: Date) => selectedDate && isSameDay(date, selectedDate);

  return (
    <div className="space-y-3">
      {/* View selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Progress
        </h2>
        <div className="flex gap-1 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {(['daily', 'weekly', 'monthly'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                view === v
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Daily view - last 7 days */}
      {view === 'daily' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex justify-between items-end gap-2">
            {last7Days.map((date) => {
              const completion = getDayCompletion(date);
              const isToday = isSameDay(date, today);
              const percentage = completion !== null ? Math.round(completion * 100) : 0;
              const height = completion !== null ? Math.max(20, percentage) : 20;
              const selected = isSelected(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`flex-1 flex flex-col items-center gap-1 group ${
                    selected ? 'scale-105' : ''
                  }`}
                >
                  <div className="w-full h-24 flex items-end justify-center">
                    <div
                      className={`w-full max-w-[32px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80 ${getCompletionColor(completion)} ${
                        selected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-xs ${
                    selected
                      ? 'font-semibold text-blue-600 dark:text-blue-400'
                      : isToday
                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(date, 'EEE')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly view */}
      {view === 'weekly' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {weekDates.map((date) => {
              const completion = getDayCompletion(date);
              const isToday = isSameDay(date, today);
              const selected = isSelected(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className="text-center group"
                >
                  <div className={`text-xs mb-1 ${
                    selected
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {format(date, 'EEE')}
                  </div>
                  <div
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:scale-105 ${
                      getCompletionColor(completion)
                    } ${
                      completion !== null && completion > 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    } ${
                      selected
                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                        : isToday
                        ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900'
                        : ''
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly view */}
      {view === 'monthly' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
            {format(today, 'MMMM yyyy')}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-[10px] text-gray-400 dark:text-gray-500 py-1">
                {day}
              </div>
            ))}
            {/* Empty cells for alignment */}
            {Array.from({ length: (monthDates[0].getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDates.map((date) => {
              const completion = getDayCompletion(date);
              const isToday = isSameDay(date, today);
              const selected = isSelected(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`aspect-square rounded flex items-center justify-center text-[10px] transition-all duration-300 hover:scale-110 ${
                    getCompletionColor(completion)
                  } ${
                    completion !== null && completion > 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                  } ${
                    selected
                      ? 'ring-2 ring-blue-500'
                      : isToday
                      ? 'ring-1 ring-emerald-500'
                      : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span>100%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-emerald-300" />
          <span>50%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-amber-300" />
          <span>1-49%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-red-300" />
          <span>0%</span>
        </div>
      </div>
    </div>
  );
}
