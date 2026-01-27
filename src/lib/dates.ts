import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, getDayOfYear } from 'date-fns';
import type { DayOfWeek, Habit } from '@/types/habit';

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getDayOfWeek(date: Date): DayOfWeek {
  return date.getDay() as DayOfWeek;
}

export function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  const dayOfWeek = getDayOfWeek(date);
  return habit.activeDays.includes(dayOfWeek);
}

export function getHabitsForDate(habits: Habit[], date: Date): Habit[] {
  return habits.filter(habit => isHabitScheduledForDate(habit, date));
}

export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function getMonthDates(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function getQuoteIndex(date: Date, totalQuotes: number): number {
  const dayOfYear = getDayOfYear(date);
  return dayOfYear % totalQuotes;
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'EEEE, MMMM d');
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}
