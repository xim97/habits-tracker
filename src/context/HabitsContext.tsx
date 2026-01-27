'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import type { Habit, HabitCompletion } from '@/types/habit';

interface HabitsContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  isHydrated: boolean;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
  isCompleted: (habitId: string, date: string) => boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  deleteCompletionsForHabit: (habitId: string) => void;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits, habitsHydrated] = useLocalStorage<Habit[]>(STORAGE_KEYS.HABITS, []);
  const [completions, setCompletions, completionsHydrated] = useLocalStorage<HabitCompletion[]>(STORAGE_KEYS.COMPLETIONS, []);

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

  const deleteCompletionsForHabit = useCallback((habitId: string) => {
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  }, [setCompletions]);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        isHydrated: habitsHydrated && completionsHydrated,
        addHabit,
        updateHabit,
        deleteHabit,
        getHabit,
        isCompleted,
        toggleCompletion,
        deleteCompletionsForHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabitsContext() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabitsContext must be used within a HabitsProvider');
  }
  return context;
}
