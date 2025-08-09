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
    <div className="space-y-20 pb-32">
      {/* Hero */}
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
            <button onClick={() => setCreating(true)} className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all transform hover:-translate-y-0.5">
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

      {/* Features */}
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
          <div className="relative group md:col-span-1 lg:col-span-2 transform hover:-translate-y-2 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Smart Splitting</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Split bills equally, by percentage, or by custom weights. Our advanced algorithm ensures perfect cent distribution with automatic rounding.
              </p>
            </div>
          </div>

          <div className="relative group md:col-span-1 lg:col-span-2 transform hover:-translate-y-2 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real-time Tracking</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                See who owes what instantly. Track payments and outstanding balances with live updates across all devices and platforms.
              </p>
            </div>
          </div>

          <div className="relative group md:col-span-1 lg:col-span-2 transform hover:-translate-y-2 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 shadow-2xl group-hover:shadow-amber-500/25 transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/25 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Period Management</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
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
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">Your Rooms</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">{stats.count}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">Split Methods</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">3</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Equal • Percent • Weight</div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">Real-time</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">✓</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Live updates
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-xl backdrop-blur-sm group hover:shadow-2xl transition-all duration-500 sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-3">Free</div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">∞</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">No limits</div>
          </div>
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
