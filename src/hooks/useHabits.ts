'use client';

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { Habit } from '@/types/habit';

export function useHabits() {
  const [habits, setHabits, isHydrated] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, [setHabits]);

  const updateHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    setHabits(prev => prev.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  }, [setHabits]);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, [setHabits]);

  const getHabit = useCallback((id: string) => {
    return habits.find(habit => habit.id === id);
  }, [habits]);

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabit,
    isHydrated,
  };
}
