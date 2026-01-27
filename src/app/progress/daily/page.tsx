'use client';

import { useState, useMemo } from 'react';
import { addDays, subDays } from 'date-fns';
import { ProgressTabs } from '@/components/progress/ProgressTabs';
import { DateNavigator } from '@/components/progress/DateNavigator';
import { HabitCheckbox } from '@/components/habits/HabitCheckbox';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDateKey, formatDisplayDate, getHabitsForDate } from '@/lib/dates';

export default function DailyProgressPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { habits, isCompleted, toggleCompletion, isHydrated } = useHabitsContext();

  const dateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const habitsForDay = useMemo(() => getHabitsForDate(habits, selectedDate), [habits, selectedDate]);

  const completedCount = useMemo(() => {
    return habitsForDay.filter(h => isCompleted(h.id, dateKey)).length;
  }, [habitsForDay, isCompleted, dateKey]);

  const percentage = habitsForDay.length > 0 ? Math.round((completedCount / habitsForDay.length) * 100) : 100;

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressTabs />

      <DateNavigator
        label={formatDisplayDate(selectedDate)}
        onPrevious={() => setSelectedDate(d => subDays(d, 1))}
        onNext={() => setSelectedDate(d => addDays(d, 1))}
        onToday={() => setSelectedDate(new Date())}
      />

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Completion</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {habitsForDay.length === 0 ? (
            'No habits scheduled'
          ) : (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{completedCount}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{habitsForDay.length}</span> completed
            </>
          )}
        </p>
      </div>

      {habitsForDay.length > 0 && (
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
      )}
    </div>
  );
}
