import Link from "next/link";

type Room = { id: number; name: string };

interface RoomGridProps {
  rooms: Room[];
  onDeleteRoom: (id: number) => void;
  onCreateRoom: () => void;
  creating: boolean;
}

export default function RoomGrid({ rooms, onDeleteRoom, onCreateRoom, creating }: RoomGridProps) {
  if (rooms.length === 0) {
    return (
      <section id="rooms" className="relative py-20 overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center mb-12">
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-xl shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-black uppercase tracking-wide">
              Your Rooms
            </span>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.9]">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
              Start your first
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              room
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-light mb-12">
            Create your first room to start splitting expenses with your <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">roommates, friends, or travel group</span>
          </p>
        </div>
        
        {/* Premium empty state card */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative transform hover:-translate-y-2 transition-all duration-700">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110"></div>
            
            {/* Main card */}
            <div className="relative rounded-3xl border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_120px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-hidden">
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
              </div>
              
              {/* Icon with enhanced design */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/30 group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                  <svg className="w-12 h-12 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0L9 9h10v12M9 9V5m5 12h2m-7 0v4" />
                  </svg>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl opacity-80 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  Ready to split?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-roboto-mono mb-8">
                  Create your first room and experience the most elegant way to manage shared expenses
                </p>
                
                {/* Premium CTA button */}
                <button 
                  onClick={onCreateRoom} 
                  className="group/btn relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 text-xl font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-4">
                    <svg className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-space-mono">Create First Room</span>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="relative py-20 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Enhanced header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 backdrop-blur-xl shadow-2xl shadow-black/5">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-black uppercase tracking-wide">
                {rooms.length} Active Room{rooms.length !== 1 ? 's' : ''}
              </span>
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[0.9]">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                Your rooms
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Manage your <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">shared expense groups</span>
            </p>
          </div>
          
          {!creating && (
            <button 
              onClick={onCreateRoom} 
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 text-lg font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-space-mono">New Room</span>
              </div>
              <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
            </button>
          )}
        </div>
        
        {/* Premium room grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map((r) => (
            <div key={r.id} className="group relative transform hover:-translate-y-2 transition-all duration-500">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110"></div>
              
              {/* Main card */}
              <div className="relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_120px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-hidden">
                
                {/* Background gradient orbs */}
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-500/20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Link overlay */}
                <Link href={`/rooms/${r.id}`} className="absolute inset-0 z-10" aria-label={`Open ${r.name}`}></Link>
                
                <div className="relative p-8">
                  {/* Header with room info */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-2xl shadow-blue-500/30 group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 overflow-hidden">
                          <div className="absolute inset-0  transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                          <span className="relative font-space-mono">{r.name.slice(0,2).toUpperCase()}</span>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-xl tracking-tight bg-gradient-to-r  dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent truncate group-hover:scale-105 transition-transform duration-300">
                          {r.name}
                        </h3>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 font-roboto-mono">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Room #{r.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteRoom(r.id); }}
                      className="relative z-20 w-10 h-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 flex items-center justify-center group/delete"
                      title="Delete room"
                    >
                      <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Room stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 font-roboto-mono">Status</span>
                      <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 font-roboto-mono">Ready to manage</span>
                      <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Ready
                      </span>
                    </div>
                  </div>
                  
                  {/* Action hint */}
                  <div className="flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-roboto-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Click to manage expenses →
                    </span>
                  </div>
                </div>
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
