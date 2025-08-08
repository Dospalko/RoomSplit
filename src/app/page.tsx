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
    <div className="space-y-14 pb-24">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-8 py-16 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-300">
            RoomSplit
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
            Jednoduché a elegantné rozdelenie spoločných výdavkov. Vytvor miestnosť, pridaj členov a sleduj účty & platby v reálnom čase.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 text-sm font-medium shadow hover:shadow-md active:scale-[.97] transition">
              <span>+ Create room</span>
            </button>
            <a href="#rooms" className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              View rooms
            </a>
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      </header>

      {/* Stats */}
      <section className="grid sm:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Rooms</div>
            <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{stats.count}</div>
            <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">Active rooms</div>
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-100/60 via-transparent to-transparent dark:from-blue-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Average members</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{rooms.length ? Math.round((/* fake placeholder until aggregated */ 0) * 10) / 10 : 0}</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">(Add aggregation later)</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-amber-100/60 via-transparent to-transparent dark:from-amber-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm group">
          <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">Total bills</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">0</div>
          <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">(Aggregate soon)</div>
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-100/60 via-transparent to-transparent dark:from-emerald-500/10" />
        </div>
      </section>

      {/* Create panel (modal style inline) */}
      {creating && (
        <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Create a room</h2>
            <button onClick={() => setCreating(false)} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm">Close</button>
          </div>
          <form onSubmit={addRoom} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Room name</label>
              <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. C211" value={name} onChange={(e) => setName(e.target.value)} />
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Short, clear identifier.</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg px-5 py-2.5 text-sm font-medium bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 text-white dark:text-neutral-900 shadow hover:shadow-md active:scale-[.97] transition">Create</button>
              <button type="button" onClick={() => setCreating(false)} className="rounded-lg px-5 py-2.5 text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms list */}
      <section id="rooms" className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Your rooms</h2>
          <button onClick={() => setCreating(true)} className="text-sm font-medium text-blue-600 hover:underline">New</button>
        </div>
        {rooms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center text-sm text-neutral-500 dark:text-neutral-400 bg-white/40 dark:bg-neutral-900/40">
            No rooms yet. Create your first one.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((r) => (
              <li key={r.id} className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition overflow-hidden">
                <Link href={`/rooms/${r.id}`} className="absolute inset-0" aria-label={`Open ${r.name}`}></Link>
                <div className="flex flex-col gap-3 min-w-0 relative z-10">
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                        {r.name.slice(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold tracking-tight text-neutral-800 dark:text-neutral-100 truncate">{r.name}</h3>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">ID {r.id}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteRoom(r.id); }}
                      className="text-[11px] text-neutral-400 hover:text-red-600 transition px-1 py-0.5 rounded"
                      title="Delete room"
                    >✕</button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Link href={`/rooms/${r.id}`} className="relative inline-flex items-center gap-1 rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition" onClick={(e)=>e.stopPropagation()}>
                      Open
                    </Link>
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">Active</span>
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
