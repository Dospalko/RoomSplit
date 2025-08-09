interface HeroProps {
  onCreateRoom: () => void;
}

export default function Hero({ onCreateRoom }: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96  rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative pt-24 pb-32 text-center max-w-7xl mx-auto px-6 lg:px-8">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-xl shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:scale-105">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-bold">
            Trusted by 10,000+ users worldwide
          </span>
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Main heading with enhanced typography */}
        <div className="relative">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.9]">
            <div className="relative inline-block">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                Room
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent blur-xl opacity-30"></div>
            </div>
            <br />
            <div className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                Split
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent blur-xl opacity-40"></div>
            </div>
          </h1>
          
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 border-2 border-blue-200 dark:border-blue-800 rounded-full opacity-20 animate-spin"></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 border-2 border-indigo-200 dark:border-indigo-800 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        {/* Enhanced description */}
        <div className="max-w-5xl mx-auto mb-16">
          <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-6">
            The <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">most elegant</span> way to split shared expenses
          </p>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Create rooms, add members, track bills and payments in real-time. Perfect for roommates, shared apartments, group trips, and collaborative living.
          </p>
        </div>
        
        {/* Premium CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <button 
            onClick={onCreateRoom} 
            className="group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 text-xl font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-4">
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Start Splitting Now</span>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </div>
            <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
          </button>
          
          <a 
            href="#features" 
            className="group inline-flex items-center gap-4 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-10 py-5 text-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>See How It Works</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Enhanced floating demo cards with better animations */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* First card - Room overview */}
            <div className="transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:z-10">
              <div className="rounded-3xl bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.15)] transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
                    AP
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900 dark:text-slate-100">Apartment 4B</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      3 active members
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
                  €450.00
                </div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Monthly expenses</div>
              </div>
            </div>
            
            {/* Second card - Expense breakdown */}
            <div className="transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:z-10">
              <div className="rounded-3xl bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.15)] transition-all duration-500">
                <div className="space-y-5">
                  <div className="flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Electricity</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-slate-100">€120.00</span>
                  </div>
                  <div className="flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Internet</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-slate-100">€35.00</span>
                  </div>
                  <div className="flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Groceries</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-slate-100">€180.00</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Third card - Member status */}
            <div className="transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:z-10">
              <div className="rounded-3xl bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.15)] transition-all duration-500">
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100">Alice</div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        All settled up
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl p-3 -m-3 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black shadow-lg">B</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-slate-100">Bob</div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        Owes €40.00
                      </div>
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
