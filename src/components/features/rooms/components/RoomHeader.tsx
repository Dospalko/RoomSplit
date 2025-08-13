import React from 'react';
import { Room, RoomSummary, fmt } from '../types';

interface RoomHeaderProps {
  room: Room | null;
  rid: number;
  summary: RoomSummary | null;
  memberCount: number;
  billCount: number;
  totals: {
    total: number;
    paid: number;
    outstanding: number;
    paidShares: number;
  };
  onDeleteRoom: () => void;
  onViewAnalytics: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  room,
  rid,
  summary,
  memberCount,
  billCount,
  totals,
  onDeleteRoom,
  onViewAnalytics
}) => {
  const statCard = (label: string, value: string, extra?: string, accent?: string) => (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-4 shadow-sm group`}>      
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">{label}</div>
      <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</div>
      {extra && <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">{extra}</div>}
      <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accent || "from-blue-100/60 via-transparent to-transparent dark:from-blue-500/10"}`}></div>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-6 py-8 shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {room?.name || `Room #${rid}`}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <button 
              onClick={onDeleteRoom} 
              className="group relative px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border border-red-200/60 dark:border-red-700/40 rounded-xl hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 hover:border-red-300/80 dark:hover:border-red-600/60 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                <svg className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete room</span>
              </div>
            </button>
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
          {statCard("Members", String(memberCount))}
          {statCard("Bills", String(billCount))}
          {statCard("Outstanding", fmt(totals.outstanding), `${(totals.paidShares && Math.round((totals.paid / (totals.total||1))*100)) || 0}% paid`, "from-amber-100/70 dark:from-amber-500/20")}
          {statCard("Total", fmt(totals.total), `${fmt(totals.paid)} paid`, "from-emerald-100/70 dark:from-emerald-500/20")}
          {billCount > 0 && (
            <div className="sm:col-span-2 md:col-span-4 mt-2">
              <button
                onClick={onViewAnalytics}
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
  );
};
