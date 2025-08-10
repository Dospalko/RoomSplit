"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { ExpenseAnalytics, SkeletonLoader, DataLoader, ButtonLoader } from "@/components";

// Domain types
type Member = { id: number; name: string };
type Share = { id: number; memberId: number; amountCents: number; paid: boolean; member?: { id: number; name: string } };
type BillRule = 'EQUAL' | 'PERCENT' | 'WEIGHT';
type BillMeta = { percents?: Record<string, number>; weights?: Record<string, number> } | null;
type Bill = { id: number; title: string; amountCents: number; period: string; shares: Share[]; rule?: BillRule; meta?: BillMeta };

const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const rid = Number(roomId);

  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [memberName, setMemberName] = useState("");
  const [title, setTitle] = useState("Electricity");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState("80");
  const [summary, setSummary] = useState<{ period: string; totalCents: number; perMember: Record<string, { name: string; cents: number }> } | null>(null);
  const [rule, setRule] = useState<BillRule>('EQUAL');
  const [percentMeta, setPercentMeta] = useState<Record<number, string>>({});
  const [weightMeta, setWeightMeta] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [addingBill, setAddingBill] = useState(false);

  // Derived maps & aggregates
  const memberNameById = useMemo(() => members.reduce<Record<number, string>>((acc, m) => { acc[m.id] = m.name; return acc; }, {}), [members]);

  const totals = useMemo(() => {
    let total = 0, paid = 0, outstanding = 0, sharesCount = 0, paidShares = 0;
    for (const b of bills) {
      total += b.amountCents;
      for (const s of b.shares) {
        sharesCount++;
        if (s.paid) { paid += s.amountCents; paidShares++; } else outstanding += s.amountCents;
      }
    }
    return { total, paid, outstanding, sharesCount, paidShares };
  }, [bills]);

  const perMemberBalance = useMemo(() => {
    // Positive => still needs to pay; Negative => overpaid (not tracked yet here, just unpaid sum)
    const map: Record<number, number> = {};
    for (const m of members) map[m.id] = 0;
    for (const b of bills) {
      for (const s of b.shares) {
        if (!s.paid) map[s.memberId] = (map[s.memberId] || 0) + s.amountCents;
      }
    }
    return map;
  }, [bills, members]);

  // Data loader
  const load = useCallback(async () => {
    if (!Number.isFinite(rid)) return;
    try {
      const [m, b, s] = await Promise.all([
        fetch(`/api/rooms/${rid}/members`).then((r) => r.json()),
        fetch(`/api/rooms/${rid}/bills`).then((r) => r.json()),
        fetch(`/api/rooms/${rid}/summary?period=${period}`).then((r) => r.json()).catch(() => null),
      ]);
      setMembers(m);
      setBills(b);
      setSummary(s && !s.error ? s : null);
    } catch {
      // swallow for now
    }
  }, [rid, period]);

  useEffect(() => { load(); }, [load]);

  // Actions
  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    await fetch(`/api/rooms/${rid}/members`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: memberName.trim() }) });
    setMemberName("");
    load();
  };

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!title.trim() || !amountNum || !period.match(/^\d{4}-\d{2}$/)) return;
  let meta: BillMeta = null;
    if (rule === 'PERCENT') {
      // Build percents map, validate sum ~ 100
      const percents: Record<number, number> = {};
      let sum = 0;
      for (const m of members) {
        const v = Number(percentMeta[m.id] || 0);
        if (v < 0) return;
        percents[m.id] = v;
        sum += v;
      }
      if (Math.abs(sum - 100) > 0.01) {
        alert('Percents must sum to 100');
        return;
      }
      meta = { percents };
    } else if (rule === 'WEIGHT') {
      const weights: Record<number, number> = {};
      let sum = 0;
      for (const m of members) {
        const v = Number(weightMeta[m.id] || 0);
        if (v < 0) return;
        weights[m.id] = v;
        sum += v;
      }
      if (sum <= 0) {
        alert('Total weight must be > 0');
        return;
      }
      meta = { weights };
    }
    await fetch(`/api/rooms/${rid}/bills`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), amount: amountNum, period, rule, meta }) });
    load();
  };

  const markPaid = async (shareId: number, paid: boolean) => {
    await fetch(`/api/shares/${shareId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paid }) });
    load();
  };

  const deleteMember = async (memberId: number) => {
    if (!confirm("Delete member? Their shares will also be removed.")) return;
    await fetch(`/api/rooms/${rid}/members/${memberId}`, { method: 'DELETE' });
    load();
  };
  const deleteBill = async (billId: number) => {
    if (!confirm("Delete bill and all its shares?")) return;
    await fetch(`/api/rooms/${rid}/bills/${billId}`, { method: 'DELETE' });
    load();
  };
  const deleteRoom = async () => {
    if (!confirm("Delete entire room (irreversible)?")) return;
    await fetch(`/api/rooms?id=${rid}`, { method: 'DELETE' });
    window.location.href = '/';
  };

  // UI helpers
  const statCard = (label: string, value: string, extra?: string, accent?: string) => (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-4 shadow-sm group`}>      
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">{label}</div>
      <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</div>
      {extra && <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">{extra}</div>}
      <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accent || "from-blue-100/60 via-transparent to-transparent dark:from-blue-500/10"}`}></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-6 py-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Room #{rid}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={deleteRoom} className="text-xs rounded-md border border-red-300/50 dark:border-red-700/40 text-red-600 dark:text-red-400 px-3 py-1 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition">Delete room</button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-prose">
              Sleduj členov, vytváraj účty a označuj platby. Elegantné rozdelenie nákladov v reálnom čase.
            </p>
            {summary && (
              <div className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm px-4 py-3 text-xs md:text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Period: <b>{summary.period}</b> • Total: <b>{fmt(summary.totalCents)}</b>
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-x-3 gap-y-1">
                  {Object.values(summary.perMember).map((pm) => (
                    <span key={pm.name}>{pm.name}: {fmt(pm.cents)}</span>
                  ))}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[260px] md:min-w-[520px]">
            {statCard("Members", String(members.length))}
            {statCard("Bills", String(bills.length))}
            {statCard("Outstanding", fmt(totals.outstanding), `${(totals.paidShares && Math.round((totals.paid / (totals.total||1))*100)) || 0}% paid`, "from-amber-100/70 dark:from-amber-500/20")}
            {statCard("Total", fmt(totals.total), `${fmt(totals.paid)} paid`, "from-emerald-100/70 dark:from-emerald-500/20")}
            {bills.length > 0 && (
              <div className="sm:col-span-2 md:col-span-4 mt-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="w-full group relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-700/40 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>View Analytics Dashboard</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      </div>

      {/* Tab Navigation */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-6 py-4 shadow-sm mb-8">
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Analytics
              {bills.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  {bills.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        /* Overview Tab - Original Content */
        <>
          {/* Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left column: Members + New Bill */}
        <div className="space-y-8 lg:col-span-4 order-2 lg:order-1">
          {/* Members Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">Members</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">{members.length}</span>
            </div>
            <div className="px-5 pb-5">
              <form onSubmit={addMember} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Name</label>
                  <input
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Alice"
                  />
                </div>
                <button className="rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow hover:shadow-md active:scale-[.98] transition" type="submit">
                  Add
                </button>
              </form>
              <ul className="mt-5 grid sm:grid-cols-1 gap-2 max-h-72 overflow-auto pr-1">
                {members.length === 0 && <li className="text-xs text-neutral-500">No members yet.</li>}
                {members.map((m) => {
                  const balance = perMemberBalance[m.id] || 0;
                  const badge = balance > 0 ? `${fmt(balance)} due` : "clear";
                  return (
                    <li key={m.id} className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2 flex items-center justify-between text-sm hover:border-blue-400/60 hover:bg-blue-50/70 dark:hover:bg-blue-500/10 transition">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold shadow-inner">
                          {m.name.slice(0,2).toUpperCase()}
                        </div>
                        <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full ml-3 shrink-0 ${balance>0 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"}`}>{badge}</span>
                        <button onClick={() => deleteMember(m.id)} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-600 transition text-xs px-1" title="Delete member">✕</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* New Bill Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">New Bill</h2>
            </div>
            <div className="px-5 pb-5">
              <form onSubmit={addBill} className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Title</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Electricity" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Period (YYYY-MM)</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2025-08" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Amount (€)</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="80" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Rule</label>
                  <select value={rule} onChange={(e)=>setRule(e.target.value as BillRule)} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="EQUAL">Equal</option>
                    <option value="PERCENT">Percent</option>
                    <option value="WEIGHT">Weight</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  {rule === 'PERCENT' && (
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-white/50 dark:bg-neutral-950/30">
                      <div className="text-[11px] uppercase tracking-wide font-medium text-neutral-500 dark:text-neutral-400 mb-2">Percents (sum must be 100)</div>
                      <div className="grid grid-cols-2 gap-2">
                        {members.map(m => (
                          <label key={m.id} className="flex items-center gap-2 text-xs">
                            <span className="truncate flex-1">{m.name}</span>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={percentMeta[m.id] ?? ''}
                              onChange={(e)=> setPercentMeta(p => ({ ...p, [m.id]: e.target.value }))}
                              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"/>
                            <span className="text-neutral-500">%</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {rule === 'WEIGHT' && (
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-white/50 dark:bg-neutral-950/30">
                      <div className="text-[11px] uppercase tracking-wide font-medium text-neutral-500 dark:text-neutral-400 mb-2">Weights (relative importance)</div>
                      <div className="grid grid-cols-2 gap-2">
                        {members.map(m => (
                          <label key={m.id} className="flex items-center gap-2 text-xs">
                            <span className="truncate flex-1">{m.name}</span>
                            <input
                              type="number"
                              min={0}
                              step="1"
                              value={weightMeta[m.id] ?? ''}
                              onChange={(e)=> setWeightMeta(p => ({ ...p, [m.id]: e.target.value }))}
                              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"/>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full rounded-lg py-2.5 text-sm font-medium bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 text-white dark:text-neutral-900 shadow hover:shadow-md active:scale-[.985] transition">
                    Create ({rule.toLowerCase()}) split
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Bills */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight text-lg">Bills</h2>
            {totals.total > 0 && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> paid {fmt(totals.paid)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> outstanding {fmt(totals.outstanding)}
                </span>
              </div>
            )}
          </div>
          {bills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-sm text-neutral-500 dark:text-neutral-400 bg-white/40 dark:bg-neutral-900/40">
              No bills yet. Create the first one on the left.
            </div>
          ) : (
            <div className="space-y-6">
              {bills.map((b) => {
                const paidAmount = b.shares.filter(s => s.paid).reduce((a,s)=>a+s.amountCents,0);
                const ratio = paidAmount / (b.amountCents || 1);
                return (
                  <div key={b.id} className="relative group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="p-5 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-base font-semibold tracking-tight text-neutral-800 dark:text-neutral-100 truncate">{b.title}</h3>
                            <span className="text-[11px] uppercase font-medium tracking-wide px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">{b.period}</span>
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-3">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">{fmt(b.amountCents)}</span>
                            <span className="text-[11px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {Math.round(ratio*100)}% paid
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${Math.min(100, Math.round(ratio*100))}%` }} />
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <button onClick={() => deleteBill(b.id)} className="text-xs text-neutral-400 hover:text-red-600 transition" title="Delete bill">Delete</button>
                        </div>
                      </div>
                      <ul className="mt-5 grid md:grid-cols-2 gap-2">
                        {b.shares.map((s) => {
                          const displayName = s.member?.name || memberNameById[s.memberId] || `Member ${s.memberId}`;
                          return (
                            <li key={s.id} className={`group/share relative rounded-lg border flex items-center justify-between gap-3 px-3 py-2 text-xs sm:text-sm transition ${s.paid ? "border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-500/10 dark:border-emerald-500/30" : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/40 hover:border-blue-400/60 hover:bg-blue-50/50 dark:hover:bg-blue-500/10"}`}>
                              <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium">{displayName}</span>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{fmt(s.amountCents)}</span>
                              </div>
                              {s.paid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.92a1 1 0 011.408-1.42l3.036 3.016 6.536-6.525a1 1 0 011.428 0z" clipRule="evenodd" /></svg>
                                  PAID
                                </span>
                              ) : (
                                <button onClick={() => markPaid(s.id, true)} className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-[10px] font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                                  mark paid
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-500/10 blur-2xl pointer-events-none -z-10" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 blur-2xl pointer-events-none -z-10" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
        </>
      ) : (
        /* Analytics Tab */
        <ExpenseAnalytics members={members} bills={bills} />
      )}
    </div>
  );
}
