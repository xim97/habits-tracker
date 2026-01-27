'use client';

import type { DayOfWeek } from '@/types/habit';
import { DAY_NAMES } from '@/types/habit';

interface DaySelectorProps {
  value: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

const DAYS_ORDER: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun

export function DaySelector({ value, onChange }: DaySelectorProps) {
  const toggleDay = (day: DayOfWeek) => {
    if (value.includes(day)) {
      onChange(value.filter(d => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  const selectAll = () => {
    onChange([0, 1, 2, 3, 4, 5, 6]);
  };

  const selectWeekdays = () => {
    onChange([1, 2, 3, 4, 5]);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {DAYS_ORDER.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`flex-1 py-2 px-1 text-sm font-medium rounded-lg transition-colors ${
              value.includes(day)
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {DAY_NAMES[day]}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Every day
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          type="button"
          onClick={selectWeekdays}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Weekdays only
        </button>
      </div>
    </div>
  );
}
