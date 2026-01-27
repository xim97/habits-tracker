'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { DaySelector } from './DaySelector';
import { useHabitsContext } from '@/context/HabitsContext';
import type { Habit, DayOfWeek } from '@/types/habit';
import { HABIT_COLORS } from '@/types/habit';

interface HabitFormProps {
  habit?: Habit;
}

export function HabitForm({ habit }: HabitFormProps) {
  const router = useRouter();
  const { addHabit, updateHabit } = useHabitsContext();

  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0]);
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(habit?.activeDays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Habit name is required');
      return;
    }

    if (activeDays.length === 0) {
      setError('Select at least one day');
      return;
    }

    if (habit) {
      updateHabit(habit.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        activeDays,
      });
    } else {
      addHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        activeDays,
      });
    }

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        id="name"
        label="Habit name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        placeholder="e.g., Morning meditation"
        autoFocus
      />

      <Input
        id="description"
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., 10 minutes of mindfulness"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Active days
        </label>
        <DaySelector value={activeDays} onChange={(days) => {
          setActiveDays(days);
          setError('');
        }} />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {habit ? 'Save changes' : 'Create habit'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
