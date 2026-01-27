'use client';

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { HabitCompletion } from '@/types/habit';

export function useCompletions() {
  const [completions, setCompletions, isHydrated] = useLocalStorage<HabitCompletion[]>(STORAGE_KEYS.COMPLETIONS, []);

  const isCompleted = useCallback((habitId: string, date: string) => {
    return completions.some(c => c.habitId === habitId && c.date === date);
  }, [completions]);

  const toggleCompletion = useCallback((habitId: string, date: string) => {
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === date);
      if (existing) {
        return prev.filter(c => c.id !== existing.id);
      } else {
        const newCompletion: HabitCompletion = {
          id: uuidv4(),
          habitId,
          date,
          completedAt: new Date().toISOString(),
        };
        return [...prev, newCompletion];
      }
    });
  }, [setCompletions]);

  const getCompletionsForDate = useCallback((date: string) => {
    return completions.filter(c => c.date === date);
  }, [completions]);

  const getCompletionsForHabit = useCallback((habitId: string) => {
    return completions.filter(c => c.habitId === habitId);
  }, [completions]);

  const getCompletionsInRange = useCallback((startDate: string, endDate: string) => {
    return completions.filter(c => c.date >= startDate && c.date <= endDate);
  }, [completions]);

  const deleteCompletionsForHabit = useCallback((habitId: string) => {
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  }, [setCompletions]);

  return {
    completions,
    isCompleted,
    toggleCompletion,
    getCompletionsForDate,
    getCompletionsForHabit,
    getCompletionsInRange,
    deleteCompletionsForHabit,
    isHydrated,
  };
}
