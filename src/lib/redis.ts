import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Redis keys
export const REDIS_KEYS = {
  HABITS: 'habits',
  COMPLETIONS: 'completions',
} as const;
