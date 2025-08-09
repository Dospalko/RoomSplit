interface StatsData {
  count: number;
}

interface StatsSectionProps {
  stats: StatsData;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      label: "Your Rooms",
      value: stats.count.toString(),
      subtitle: "Active",
      gradient: "from-blue-500/5 to-indigo-500/5",
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
    },
    {
      label: "Split Methods",
      value: "3",
      subtitle: "Equal • Percent • Weight",
      gradient: "from-emerald-500/5 to-teal-500/5"
    },
    {
      label: "Real-time",
      value: "✓",
      subtitle: "Live updates",
      gradient: "from-amber-500/5 to-orange-500/5",
      icon: <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
    },
    {
      label: "Free",
      value: "∞",
      subtitle: "No limits",
      gradient: "from-purple-500/5 to-pink-500/5"
    }
  ];

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 sm:col-span-1 lg:col-span-1 xl:col-span-2"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">
              {item.label}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
              {item.value}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              {item.icon}
              {item.subtitle}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
