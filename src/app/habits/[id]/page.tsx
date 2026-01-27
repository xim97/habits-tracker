'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { HabitForm } from '@/components/habits/HabitForm';
import { useHabitsContext } from '@/context/HabitsContext';

interface EditHabitPageProps {
  params: Promise<{ id: string }>;
}

export default function EditHabitPage({ params }: EditHabitPageProps) {
  const { id } = use(params);
  const { getHabit, isHydrated } = useHabitsContext();
  const habit = getHabit(id);

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
    );
  }

  if (!habit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Edit habit
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Update your habit details
        </p>
      </div>
      <HabitForm habit={habit} />
    </div>
  );
}
