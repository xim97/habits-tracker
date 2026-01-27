'use client';

interface DateNavigatorProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
}

export function DateNavigator({ label, onPrevious, onNext, onToday }: DateNavigatorProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Previous"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
        {onToday && (
          <button
            onClick={onToday}
            className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Today
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Next"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
