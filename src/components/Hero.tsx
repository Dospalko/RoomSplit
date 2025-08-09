interface HeroProps {
  onCreateRoom: () => void;
}

export default function Hero({ onCreateRoom }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10 blur-3xl"></div>
      <div className="relative pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Split expenses effortlessly
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent">
            Room
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Split
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto mb-12 font-light">
          The elegant way to split shared expenses. Create rooms, add members, track bills and payments in real-time. 
          <span className="block mt-3 text-lg opacity-80">Perfect for roommates, shared apartments, group trips, and collaborative living.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button onClick={onCreateRoom} className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all transform hover:-translate-y-0.5">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Get Started Free
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
          <a href="#features" className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 shadow-lg">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </a>
        </div>

        {/* Floating Demo Cards */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="transform rotate-2 hover:rotate-0 transition-transform">
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    AP
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Apartment 4B</div>
                    <div className="text-xs text-slate-500">3 members</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">€450.00</div>
                <div className="text-sm text-slate-500">Monthly expenses</div>
              </div>
            </div>
            
            <div className="transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-2xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Electricity</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">€120.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Internet</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">€35.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Groceries</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">€180.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="transform rotate-1 hover:rotate-0 transition-transform">
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-2xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Alice</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">All paid ✓</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">B</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Bob</div>
                      <div className="text-xs text-amber-600 dark:text-amber-400">€40 pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
