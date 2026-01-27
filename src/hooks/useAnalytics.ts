'use client';

import { subDays, parseISO, isBefore, isEqual } from 'date-fns';
import { useHabitsContext } from '@/context/HabitsContext';
import { formatDateKey, getHabitsForDate } from '@/lib/dates';
import type { AnalyticsData, DayProgress } from '@/types/habit';

export function useAnalytics(daysToAnalyze: number = 30) {
  const { habits, completions, isHydrated } = useHabitsContext();

  // Calculate daily progress
  const today = new Date();
  const dailyProgress: DayProgress[] = [];

  for (let i = daysToAnalyze - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = formatDateKey(date);

    const habitsForDay = getHabitsForDate(habits, date).filter(habit => {
      const createdAt = parseISO(habit.createdAt);
      return isBefore(createdAt, date) || isEqual(createdAt, date) || formatDateKey(createdAt) === dateKey;
    });

    const completedHabits = habitsForDay.filter(habit =>
      completions.some(c => c.habitId === habit.id && c.date === dateKey)
    ).length;

    const totalHabits = habitsForDay.length;

    dailyProgress.push({
      date: dateKey,
      totalHabits,
      completedHabits,
      isPerfectDay: totalHabits > 0 && completedHabits === totalHabits,
    });
  }

  // Calculate stats
  const daysWithHabits = dailyProgress.filter(d => d.totalHabits > 0);
  const totalDays = daysWithHabits.length;
  const perfectDays = daysWithHabits.filter(d => d.isPerfectDay).length;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = dailyProgress.length - 1; i >= 0; i--) {
    const day = dailyProgress[i];
    if (day.totalHabits === 0) continue;

    if (day.isPerfectDay) {
      tempStreak++;
      if (i === dailyProgress.length - 1 || currentStreak > 0) {
        currentStreak = tempStreak;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (currentStreak === 0) currentStreak = 0;
      tempStreak = 0;
    }
  }

  const totalCompletion = daysWithHabits.reduce((sum, d) => {
    return sum + (d.totalHabits > 0 ? (d.completedHabits / d.totalHabits) * 100 : 0);
  }, 0);

  const stats: AnalyticsData = {
    totalDays,
    perfectDays,
    perfectDayPercentage: totalDays > 0 ? Math.round((perfectDays / totalDays) * 100) : 0,
    currentStreak,
    longestStreak,
    averageCompletion: totalDays > 0 ? Math.round(totalCompletion / totalDays) : 0,
  };

  return {
    stats,
    dailyProgress,
    isHydrated,
  };
}
