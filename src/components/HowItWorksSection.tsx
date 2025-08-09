export default function HowItWorksSection() {
  const steps = [
    { 
      step: "01", 
      title: "Create Room", 
      desc: "Set up a shared space for your group with one click",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10",
      shadowColor: "blue-500/30"
    },
    { 
      step: "02", 
      title: "Add Members & Bills", 
      desc: "Invite people and start tracking expenses in real-time",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
      shadowColor: "emerald-500/30"
    },
    { 
      step: "03", 
      title: "Split & Track", 
      desc: "Choose split methods and mark payments automatically",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-500/10 via-orange-500/10 to-red-500/10",
      shadowColor: "amber-500/30"
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full px-6 lg:px-8">
        {/* Enhanced header section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-xl shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-black uppercase tracking-wide">
              Simple Process
            </span>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
              How it
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              works
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto font-light">
            Get started in minutes with our <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">revolutionary</span> 3-step process
          </p>
        </div>
        
        {/* Premium steps grid */}
        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {steps.map((item, index) => (
            <div key={index} className="group relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-full w-12 h-0.5 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700 dark:to-transparent z-10 transform translate-x-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              )}
              
              {/* Step card */}
              <div className="relative transform hover:-translate-y-4 transition-all duration-700 group-hover:scale-105">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110`}></div>
                
                {/* Main card */}
                <div className={`relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-10 shadow-[0_20px_70px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_120px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-hidden`}>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
                  </div>
                  
                  {/* Step number with enhanced design */}
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-${item.shadowColor} group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                      <span className="relative font-space-mono">{item.step}</span>
                    </div>
                    
                    {/* Floating icon */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl md:text-3xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-roboto-mono">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 px-8 py-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-roboto-mono">Ready to start?</span>
            </div>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-roboto-mono">Takes less than 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
