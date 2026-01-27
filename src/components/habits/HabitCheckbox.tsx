'use client';

import type { Habit } from '@/types/habit';

interface HabitCheckboxProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export function HabitCheckbox({ habit, isCompleted, onToggle }: HabitCheckboxProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
        isCompleted
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isCompleted
            ? 'border-emerald-500 bg-emerald-500 scale-110'
            : 'border-gray-300 dark:border-gray-600 scale-100'
        }`}
        style={isCompleted ? {} : { borderColor: habit.color }}
      >
        <svg
          className={`w-4 h-4 text-white transition-all duration-200 ${
            isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 text-left">
        <span
          className={`font-medium ${
            isCompleted
              ? 'text-emerald-700 dark:text-emerald-300 line-through'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {habit.name}
        </span>
        {habit.description && (
          <p className={`text-sm mt-0.5 ${isCompleted ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-gray-500 dark:text-gray-400'}`}>
            {habit.description}
          </p>
        )}
      </div>
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: habit.color }}
      />
    </button>
  );
}
