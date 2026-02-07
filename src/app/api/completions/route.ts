import { NextResponse } from 'next/server';
import { redis, REDIS_KEYS } from '@/lib/redis';
import type { HabitCompletion } from '@/types/habit';

// GET - Fetch all completions
export async function GET() {
  try {
    const completions = await redis.get<HabitCompletion[]>(REDIS_KEYS.COMPLETIONS);
    return NextResponse.json({ completions: completions || [] });
  } catch (error) {
    console.error('Failed to fetch completions:', error);
    return NextResponse.json({ error: 'Failed to fetch completions' }, { status: 500 });
  }
}

// POST - Add a single completion to the array
export async function POST(request: Request) {
  try {
    const completion: HabitCompletion = await request.json();
    const completions = (await redis.get<HabitCompletion[]>(REDIS_KEYS.COMPLETIONS)) || [];

    // Check if already exists (prevent duplicates)
    const exists = completions.some(
      (c) => c.habitId === completion.habitId && c.date === completion.date
    );

    if (!exists) {
      completions.push(completion);
      await redis.set(REDIS_KEYS.COMPLETIONS, completions);
    }

    return NextResponse.json({ success: true, completion });
  } catch (error) {
    console.error('Failed to add completion:', error);
    return NextResponse.json({ error: 'Failed to add completion' }, { status: 500 });
  }
}

// DELETE - Remove a single completion from the array
export async function DELETE(request: Request) {
  try {
    const { habitId, date }: { habitId: string; date: string } = await request.json();
    const completions = (await redis.get<HabitCompletion[]>(REDIS_KEYS.COMPLETIONS)) || [];

    const filtered = completions.filter(
      (c) => !(c.habitId === habitId && c.date === date)
    );

    await redis.set(REDIS_KEYS.COMPLETIONS, filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete completion:', error);
    return NextResponse.json({ error: 'Failed to delete completion' }, { status: 500 });
  }
}
