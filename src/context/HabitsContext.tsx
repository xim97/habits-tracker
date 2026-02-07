'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { Habit, HabitCompletion } from '@/types/habit';

interface HabitsContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  isLoading: boolean;
  isHydrated: boolean;
  isSaving: boolean;
  error: Error | null;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
  isCompleted: (habitId: string, date: string) => boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  deleteCompletionsForHabit: (habitId: string) => void;
}

const HABITS_KEY = ['habits'];
const COMPLETIONS_KEY = ['completions'];

// API functions
async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch('/api/habits');
  if (!response.ok) throw new Error('Failed to fetch habits');
  const data = await response.json();
  return data.habits;
}

async function fetchCompletions(): Promise<HabitCompletion[]> {
  const response = await fetch('/api/completions');
  if (!response.ok) throw new Error('Failed to fetch completions');
  const data = await response.json();
  return data.completions;
}

async function apiAddHabit(habit: Habit): Promise<Habit> {
  const response = await fetch('/api/habits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit),
  });
  if (!response.ok) throw new Error('Failed to add habit');
  return habit;
}

async function apiUpdateHabit(id: string, updates: Partial<Habit>): Promise<void> {
  const response = await fetch('/api/habits', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates }),
  });
  if (!response.ok) throw new Error('Failed to update habit');
}

async function apiDeleteHabit(id: string): Promise<void> {
  const response = await fetch('/api/habits', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error('Failed to delete habit');
}

async function apiAddCompletion(completion: HabitCompletion): Promise<void> {
  const response = await fetch('/api/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(completion),
  });
  if (!response.ok) throw new Error('Failed to add completion');
}

async function apiDeleteCompletion(habitId: string, date: string): Promise<void> {
  const response = await fetch('/api/completions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habitId, date }),
  });
  if (!response.ok) throw new Error('Failed to delete completion');
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Queries
  const habitsQuery = useQuery({
    queryKey: HABITS_KEY,
    queryFn: fetchHabits,
    staleTime: 1000 * 60,
  });

  const completionsQuery = useQuery({
    queryKey: COMPLETIONS_KEY,
    queryFn: fetchCompletions,
    staleTime: 1000 * 60,
  });

  const habits = habitsQuery.data || [];
  const completions = completionsQuery.data || [];
  const isLoading = habitsQuery.isLoading || completionsQuery.isLoading;
  const error = habitsQuery.error || completionsQuery.error;

  // Mutations
  const addHabitMutation = useMutation({
    mutationFn: apiAddHabit,
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_KEY);
      queryClient.setQueryData<Habit[]>(HABITS_KEY, (old) => [...(old || []), newHabit]);
      return { previous };
    },
    onError: (_err, _newHabit, context) => {
      if (context?.previous) queryClient.setQueryData(HABITS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Habit> }) =>
      apiUpdateHabit(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      const previous = queryClient.getQueryData<Habit[]>(HABITS_KEY);
      queryClient.setQueryData<Habit[]>(HABITS_KEY, (old) =>
        (old || []).map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(HABITS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY }),
  });

  const deleteHabitMutation = useMutation({
    mutationFn: apiDeleteHabit,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_KEY });
      const previousHabits = queryClient.getQueryData<Habit[]>(HABITS_KEY);
      const previousCompletions = queryClient.getQueryData<HabitCompletion[]>(COMPLETIONS_KEY);
      queryClient.setQueryData<Habit[]>(HABITS_KEY, (old) =>
        (old || []).filter((h) => h.id !== id)
      );
      queryClient.setQueryData<HabitCompletion[]>(COMPLETIONS_KEY, (old) =>
        (old || []).filter((c) => c.habitId !== id)
      );
      return { previousHabits, previousCompletions };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHabits) queryClient.setQueryData(HABITS_KEY, context.previousHabits);
      if (context?.previousCompletions) queryClient.setQueryData(COMPLETIONS_KEY, context.previousCompletions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_KEY });
      queryClient.invalidateQueries({ queryKey: COMPLETIONS_KEY });
    },
  });

  const addCompletionMutation = useMutation({
    mutationFn: apiAddCompletion,
    onMutate: async (newCompletion) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_KEY });
      const previous = queryClient.getQueryData<HabitCompletion[]>(COMPLETIONS_KEY);
      queryClient.setQueryData<HabitCompletion[]>(COMPLETIONS_KEY, (old) => [
        ...(old || []),
        newCompletion,
      ]);
      return { previous };
    },
    onError: (_err, _newCompletion, context) => {
      if (context?.previous) queryClient.setQueryData(COMPLETIONS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: COMPLETIONS_KEY }),
  });

  const deleteCompletionMutation = useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      apiDeleteCompletion(habitId, date),
    onMutate: async ({ habitId, date }) => {
      await queryClient.cancelQueries({ queryKey: COMPLETIONS_KEY });
      const previous = queryClient.getQueryData<HabitCompletion[]>(COMPLETIONS_KEY);
      queryClient.setQueryData<HabitCompletion[]>(COMPLETIONS_KEY, (old) =>
        (old || []).filter((c) => !(c.habitId === habitId && c.date === date))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(COMPLETIONS_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: COMPLETIONS_KEY }),
  });

  // Context methods
  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      addHabitMutation.mutate(newHabit);
      return newHabit;
    },
    [addHabitMutation]
  );

  const updateHabit = useCallback(
    (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
      updateHabitMutation.mutate({ id, updates });
    },
    [updateHabitMutation]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      deleteHabitMutation.mutate(id);
    },
    [deleteHabitMutation]
  );

  const getHabit = useCallback(
    (id: string) => habits.find((habit) => habit.id === id),
    [habits]
  );

  const isCompleted = useCallback(
    (habitId: string, date: string) =>
      completions.some((c) => c.habitId === habitId && c.date === date),
    [completions]
  );

  const toggleCompletion = useCallback(
    (habitId: string, date: string) => {
      const existing = completions.find(
        (c) => c.habitId === habitId && c.date === date
      );

      if (existing) {
        deleteCompletionMutation.mutate({ habitId, date });
      } else {
        const newCompletion: HabitCompletion = {
          id: uuidv4(),
          habitId,
          date,
          completedAt: new Date().toISOString(),
        };
        addCompletionMutation.mutate(newCompletion);
      }
    },
    [completions, addCompletionMutation, deleteCompletionMutation]
  );

  const deleteCompletionsForHabit = useCallback(
    (habitId: string) => {
      // This is handled by deleteHabit on the server
      completions
        .filter((c) => c.habitId === habitId)
        .forEach((c) => deleteCompletionMutation.mutate({ habitId: c.habitId, date: c.date }));
    },
    [completions, deleteCompletionMutation]
  );

  const isSaving =
    addHabitMutation.isPending ||
    updateHabitMutation.isPending ||
    deleteHabitMutation.isPending ||
    addCompletionMutation.isPending ||
    deleteCompletionMutation.isPending;

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        isLoading,
        isHydrated: !isLoading,
        isSaving,
        error: error as Error | null,
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
