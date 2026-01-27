export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  activeDays: DayOfWeek[];
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completedAt: string;
}

export interface DayProgress {
  date: string;
  totalHabits: number;
  completedHabits: number;
  isPerfectDay: boolean;
}

export interface AnalyticsData {
  totalDays: number;
  perfectDays: number;
  perfectDayPercentage: number;
  currentStreak: number;
  longestStreak: number;
  averageCompletion: number;
}

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export const HABIT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
];
