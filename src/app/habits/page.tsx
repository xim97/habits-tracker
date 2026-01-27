'use client';

import Link from 'next/link';
import { useHabitsContext } from '@/context/HabitsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DAY_NAMES, type DayOfWeek } from '@/types/habit';

export default function HabitsPage() {
  const { habits, deleteHabit, deleteCompletionsForHabit, isHydrated } = useHabitsContext();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit? All completion data will be lost.')) {
      deleteHabit(id);
      deleteCompletionsForHabit(id);
    }
  };

  const formatActiveDays = (days: DayOfWeek[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b)).map(d => DAY_NAMES[d]).join(', ');
  };

  if (!isHydrated) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="space-y-3">
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your habits
        </h1>
        <Link href="/add-habit">
          <Button size="sm">Add habit</Button>
        </Link>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.map((habit) => (
            <Card key={habit.id} className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {habit.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatActiveDays(habit.activeDays)}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/habits/${habit.id}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(habit.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven&apos;t created any habits yet
          </p>
          <Link href="/add-habit">
            <Button>Create your first habit</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
