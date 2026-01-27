'use client';

import { useMemo } from 'react';
import { useHabitsContext } from '@/context/HabitsContext';
import { getHabitsForDate, formatDateKey } from '@/lib/dates';

export function useTodaysHabits() {
  const { habits, isCompleted, isHydrated } = useHabitsContext();

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  const todaysHabits = useMemo(() => {
    return getHabitsForDate(habits, today);
  }, [habits, today]);

  const completedCount = useMemo(() => {
    return todaysHabits.filter(habit => isCompleted(habit.id, todayKey)).length;
  }, [todaysHabits, isCompleted, todayKey]);

  const totalCount = todaysHabits.length;

  const completionPercentage = useMemo(() => {
    if (totalCount === 0) return 100;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const isPerfectDay = completedCount === totalCount && totalCount > 0;

  return {
    todaysHabits,
    completedCount,
    totalCount,
    completionPercentage,
    isPerfectDay,
    todayKey,
    isHydrated,
  };
}
