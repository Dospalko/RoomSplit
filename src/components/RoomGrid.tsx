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
      <section id="rooms" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-1">Your rooms</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your shared expense groups</p>
          </div>
        </div>
        
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white/40 dark:bg-slate-900/40">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0L9 9h10v12M9 9V5m5 12h2m-7 0v4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Create your first room to start splitting expenses with your roommates, friends, or travel group.
          </p>
          <button onClick={onCreateRoom} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Room
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-1">Your rooms</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your shared expense groups</p>
        </div>
        {!creating && (
          <button onClick={onCreateRoom} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Room
          </button>
        )}
      </div>
      
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {rooms.map((r) => (
          <li key={r.id} className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition overflow-hidden">
            <Link href={`/rooms/${r.id}`} className="absolute inset-0 z-10" aria-label={`Open ${r.name}`}></Link>
            <div className="p-6">
              <div className="flex items-start gap-4 justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {r.name.slice(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg tracking-tight text-slate-800 dark:text-slate-100 truncate">{r.name}</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>Room #{r.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteRoom(r.id); }}
                  className="relative z-20 text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Delete room"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Click to manage expenses
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                    Ready
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-500/10 blur-2xl pointer-events-none -z-10" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 blur-2xl pointer-events-none -z-10" />
          </li>
        ))}
      </ul>
    </section>
  );
}
