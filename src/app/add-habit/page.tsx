'use client';

import { HabitForm } from '@/components/habits/HabitForm';

export default function AddHabitPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create new habit
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Define a habit you want to build
        </p>
      </div>
      <HabitForm />
    </div>
  );
}
