'use client';

import { ReactNode } from 'react';
import { HabitsProvider } from '@/context/HabitsContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HabitsProvider>
      {children}
    </HabitsProvider>
  );
}
