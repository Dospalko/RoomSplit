import "./globals.css";
import { Space_Mono, Roboto_Mono } from 'next/font/google';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata = { title: "RoomSplit" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`antialiased ${spaceMono.variable} ${robotoMono.variable}`}>
      <body 
        className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-neutral-950 dark:to-slate-900 font-mono"
        style={{
          backgroundImage: `
            linear-gradient(to right, #80808012 1px, transparent 1px),
            linear-gradient(to bottom, #80808012 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      >
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/40 border-b border-black/5 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">RoomSplit</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium">Features</a>
              <a href="#rooms" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium">Rooms</a>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg">
                <span>Get Started</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </header>
        <main className="relative mx-auto max-w-7xl px-4 lg:px-8 py-8">{children}</main>
        <footer className="relative border-t border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">RoomSplit</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live & Real-time
                </span>
                <span>•</span>
                <span>No Auth Required</span>
                <span>•</span>
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
