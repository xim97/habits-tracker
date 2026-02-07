import { NextResponse } from 'next/server';
import { redis, REDIS_KEYS } from '@/lib/redis';
import type { Habit, HabitCompletion } from '@/types/habit';

// GET - Fetch all habits
export async function GET() {
  try {
    const habits = await redis.get<Habit[]>(REDIS_KEYS.HABITS);
    return NextResponse.json({ habits: habits || [] });
  } catch (error) {
    console.error('Failed to fetch habits:', error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

// POST - Add a new habit
export async function POST(request: Request) {
  try {
    const habit: Habit = await request.json();
    const habits = (await redis.get<Habit[]>(REDIS_KEYS.HABITS)) || [];
    habits.push(habit);
    await redis.set(REDIS_KEYS.HABITS, habits);
    return NextResponse.json({ success: true, habit });
  } catch (error) {
    console.error('Failed to add habit:', error);
    return NextResponse.json({ error: 'Failed to add habit' }, { status: 500 });
  }
}

// PUT - Update a habit
export async function PUT(request: Request) {
  try {
    const { id, updates }: { id: string; updates: Partial<Habit> } = await request.json();
    const habits = (await redis.get<Habit[]>(REDIS_KEYS.HABITS)) || [];
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }
    habits[index] = { ...habits[index], ...updates };
    await redis.set(REDIS_KEYS.HABITS, habits);
    return NextResponse.json({ success: true, habit: habits[index] });
  } catch (error) {
    console.error('Failed to update habit:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}

// DELETE - Delete a habit and its completions
export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json();

    // Delete habit
    const habits = (await redis.get<Habit[]>(REDIS_KEYS.HABITS)) || [];
    const filteredHabits = habits.filter((h) => h.id !== id);
    await redis.set(REDIS_KEYS.HABITS, filteredHabits);

    // Delete completions for this habit
    const completions = (await redis.get<HabitCompletion[]>(REDIS_KEYS.COMPLETIONS)) || [];
    const filteredCompletions = completions.filter((c) => c.habitId !== id);
    await redis.set(REDIS_KEYS.COMPLETIONS, filteredCompletions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete habit:', error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}
