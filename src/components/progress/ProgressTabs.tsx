'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/progress/daily', label: 'Daily' },
  { href: '/progress/weekly', label: 'Weekly' },
  { href: '/progress/monthly', label: 'Monthly' },
];

export function ProgressTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`flex-1 py-2 px-3 text-sm font-medium text-center rounded-md transition-colors ${
            pathname === tab.href
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
