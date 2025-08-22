import React, { useState } from 'react';
import { Room, RoomSummary, fmt } from '../types';
import RoomInviteModal from './RoomInviteModal';

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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const statCard = (label: string, value: string, extra?: string, accent?: string) => (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition-all duration-200 group`}>      
      <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium mb-2">{label}</div>
      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">{value}</div>
      {extra && <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{extra}</div>}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${accent || "bg-blue-50/50 dark:bg-blue-950/20"}`}></div>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 shadow-sm">
      {/* Main Header Section */}
      <div className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Room Title & Description */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {room?.name || `Room #${rid}`}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">
              Sleduj členov, vytváraj účty a označuj platby. Elegantné rozdelenie nákladov v reálnom čase.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="group relative px-5 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700/50 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Invite Members
              </button>

              <button 
                onClick={onViewAnalytics}
                className="group relative px-5 py-2.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-700/50 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                View Analytics
              </button>
              
              <button 
                onClick={onDeleteRoom} 
                className="group relative px-5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Room Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCard("Members", String(memberCount), undefined, "from-blue-50 dark:from-blue-950/20")}
            {statCard("Bills", String(billCount), undefined, "from-purple-50 dark:from-purple-950/20")}
            {statCard("Outstanding", fmt(totals.outstanding), `${(totals.paidShares && Math.round((totals.paid / (totals.total||1))*100)) || 0}% paid`, "from-amber-50 dark:from-amber-950/20")}
            {statCard("Total", fmt(totals.total), `${fmt(totals.paid)} paid`, "from-emerald-50 dark:from-emerald-950/20")}
          </div>
        </div>

        {/* Period Summary */}
        {summary && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100 mb-3">
              Current Period
            </h3>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <span className="text-neutral-500 dark:text-neutral-400">Period:</span> <span className="font-semibold">{summary.period}</span>
                  <span className="mx-3 text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Total:</span> <span className="font-semibold">{fmt(summary.totalCents)}</span>
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {Object.values(summary.perMember).map((pm) => (
                      <span key={pm.name} className="whitespace-nowrap">
                        <span className="font-medium">{pm.name}:</span> {fmt(pm.cents)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

     
      </div>
      
      {/* Background Effects */}
      <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/5 to-purple-500/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-400/5 to-cyan-500/5 blur-3xl pointer-events-none -z-10" />
      
      {/* Room Invite Modal */}
      <RoomInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roomId={rid}
        roomName={room?.name || `Room #${rid}`}
      />
    </div>
  );
};
