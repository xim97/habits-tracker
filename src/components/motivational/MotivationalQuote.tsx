'use client';

import { useMemo } from 'react';
import { getQuoteIndex } from '@/lib/dates';
import { MOTIVATIONAL_QUOTES } from '@/lib/constants';

export function MotivationalQuote() {
  const quote = useMemo(() => {
    const index = getQuoteIndex(new Date(), MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[index];
  }, []);

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900/50">
      <p className="text-sm text-emerald-800 dark:text-emerald-200 italic">
        &ldquo;{quote.text}&rdquo;
      </p>
      {quote.author && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
          — {quote.author}
        </p>
      )}
    </div>
  );
}
