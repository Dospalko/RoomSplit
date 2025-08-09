"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

type Room = { id: number; name: string };

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    fetch("/api/rooms").then((r) => r.json()).then(setRooms).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      setName("");
      setCreating(false);
      load();
    }
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Delete this room and all its data?")) return;
    await fetch(`/api/rooms?id=${id}`, { method: 'DELETE' });
    load();
  };

  const stats = useMemo(() => ({ count: rooms.length }), [rooms]);

  return (
    <div className="space-y-16 pb-24">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-8 py-20 shadow-lg">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/50 px-4 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Split expenses effortlessly
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-300 mb-6">
            RoomSplit
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mx-auto mb-10">
            The modern way to split shared expenses. Create rooms, add members, track bills and payments in real-time. 
            <span className="block mt-2 text-base opacity-80">Perfect for roommates, shared apartments, or group trips.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl active:scale-[.97] transition transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Get Started Free
            </button>
            <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-8 py-4 text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </a>
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-500/20 blur-3xl pointer-events-none -z-10" />
      </header>

      {/* Features */}
      <section id="features" className="space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Everything you need to split expenses</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Powerful features designed to make shared expense management simple and transparent.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="relative group md:col-span-1 lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-8 shadow-sm hover:shadow-lg transition h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Splitting</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Split bills equally, by percentage, or by custom weights. Automatic rounding ensures perfect cents distribution.
              </p>
            </div>
          </div>

          <div className="relative group md:col-span-1 lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-8 shadow-sm hover:shadow-lg transition h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Real-time Tracking</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                See who owes what instantly. Track payments and outstanding balances with live updates across all devices.
              </p>
            </div>
          </div>

          <div className="relative group md:col-span-1 lg:col-span-2">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-8 shadow-sm hover:shadow-lg transition h-full">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3">Period Management</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Organize expenses by month or custom periods. Perfect for monthly rent, utilities, and recurring shared costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Get started in minutes with our simple 3-step process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            { step: "1", title: "Create Room", desc: "Set up a shared space for your group" },
            { step: "2", title: "Add Members & Bills", desc: "Invite people and start tracking expenses" },
            { step: "3", title: "Split & Track", desc: "Choose how to split and mark payments" }
          ].map((item, i) => (
            <div key={i} className="text-center md:col-span-1 lg:col-span-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Your Rooms</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{stats.count}</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">Active</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-100/60 via-transparent to-transparent dark:from-blue-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Split Methods</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">3</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">Equal, Percent, Weight</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-100/60 via-transparent to-transparent dark:from-emerald-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Real-time</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">✓</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">Live updates</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-100/60 via-transparent to-transparent dark:from-amber-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Free</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">∞</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">No limits</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-purple-100/60 via-transparent to-transparent dark:from-purple-500/10" />
        </div>
      </section>

      {/* Create panel (modal style inline) */}
      {creating && (
        <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-lg shadow-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-2">Create your first room</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Start splitting expenses with your group today.</p>
            </div>
            <button onClick={() => setCreating(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={addRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Room name</label>
              <input 
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="e.g. Apartment C211, Europe Trip 2025" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Choose a clear, descriptive name for your shared space.</p>
            </div>
            <div className="flex gap-4 pt-2">
              <button type="submit" className="flex-1 rounded-xl px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl active:scale-[.97] transition transform">
                Create Room
              </button>
              <button type="button" onClick={() => setCreating(false)} className="px-6 py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms list */}
      <section id="rooms" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-1">Your rooms</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage your shared expense groups</p>
          </div>
          {!creating && (
            <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Room
            </button>
          )}
        </div>
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-12 text-center bg-white/40 dark:bg-neutral-900/40">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0L9 9h10v12M9 9V5m5 12h2m-7 0v4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Create your first room to start splitting expenses with your roommates, friends, or travel group.
            </p>
            <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow hover:shadow-md transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Room
            </button>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {rooms.map((r) => (
              <li key={r.id} className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition overflow-hidden">
                <Link href={`/rooms/${r.id}`} className="absolute inset-0 z-10" aria-label={`Open ${r.name}`}></Link>
                <div className="p-6">
                  <div className="flex items-start gap-4 justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {r.name.slice(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg tracking-tight text-neutral-800 dark:text-neutral-100 truncate">{r.name}</h3>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span>Room #{r.id}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteRoom(r.id); }}
                      className="relative z-20 text-neutral-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Delete room"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
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
        )}
      </section>
    </div>
  );
}
