export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Smart Splitting",
      description: "Split bills equally, by percentage, or by custom weights. Our advanced algorithm ensures perfect cent distribution with automatic rounding.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-indigo-500/10",
      shadowColor: "blue-500/25"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-time Tracking",
      description: "See who owes what instantly. Track payments and outstanding balances with live updates across all devices and platforms.",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      shadowColor: "emerald-500/25"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Period Management",
      description: "Organize expenses by month or custom periods. Perfect for monthly rent, utilities, and recurring shared costs.",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      shadowColor: "amber-500/25"
    }
  ];

  return (
    <section id="features" className="space-y-16">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Powerful Features
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Everything you need to split expenses
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          Powerful features designed to make shared expense management simple, transparent, and delightful.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="relative group md:col-span-1 lg:col-span-2 transform hover:-translate-y-2 transition-all duration-500"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500`}></div>
            <div className={`relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 shadow-2xl group-hover:shadow-${feature.shadowColor} transition-all duration-500 h-full`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-2xl shadow-${feature.shadowColor} group-hover:scale-110 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
