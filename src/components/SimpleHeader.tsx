'use client';

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="w-full px-4 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01" />
            </svg>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-space-mono">
            RoomSplit
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link 
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-roboto-mono"
          >
            ← Back to Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
