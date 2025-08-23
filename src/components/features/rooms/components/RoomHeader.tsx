import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  
  const statCard = (label: string, value: string, extra?: string, icon?: React.ReactNode, color?: string) => (
    <motion.div 
      className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition-all duration-200 group cursor-pointer`}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >      
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium">
          {label}
        </div>
        {icon && (
          <div className={`p-1.5 rounded-lg ${color || 'bg-blue-100 dark:bg-blue-900/30'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
        {value}
      </div>
      {extra && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {extra}
        </div>
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-50/50 dark:bg-blue-950/20"></div>
    </motion.div>
  );

  const actionButton = (
    onClick: () => void, 
    text: string, 
    icon: React.ReactNode, 
    variant: 'primary' | 'secondary' | 'danger' = 'secondary'
  ) => {
    const variants = {
      primary: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/40',
      secondary: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/40',
      danger: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/40'
    };

    return (
      <motion.button 
        onClick={onClick}
        className={`px-4 py-2.5 text-sm font-medium border rounded-xl transition-all duration-200 flex items-center gap-2 ${variants[variant]}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {icon}
        {text}
      </motion.button>
    );
  };

  const progressPercent = totals.total > 0 ? (totals.paid / totals.total) * 100 : 0;

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >      
      {/* Main Header Section */}
      <div className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Room Title & Description */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold tracking-tight mb-3 text-neutral-900 dark:text-neutral-100">
                {room?.name || `Room #${rid}`}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">
                Track members, create bills, and mark payments. Elegant expense splitting in real-time.
              </p>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {actionButton(
                () => setShowInviteModal(true),
                "Invite Members",
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>,
                'primary'
              )}

              {actionButton(
                onViewAnalytics,
                "Analytics",
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>,
                'secondary'
              )}
              
              {actionButton(
                onDeleteRoom,
                "Delete",
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>,
                'danger'
              )}
            </motion.div>
          </div>

          {/* Quick Progress Circle - Smaller */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-200 dark:text-neutral-700" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" strokeWidth="2" strokeLinecap="round"
                  className="text-green-500"
                  strokeDasharray={`${progressPercent} 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {Math.round(progressPercent)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCard(
              "Members", 
              String(memberCount), 
              "Active users",
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>,
              "bg-blue-100 dark:bg-blue-900/30"
            )}
            {statCard(
              "Bills", 
              String(billCount), 
              "Total expenses",
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>,
              "bg-purple-100 dark:bg-purple-900/30"
            )}
            {statCard(
              "Outstanding", 
              fmt(totals.outstanding), 
              `${Math.round((totals.paid / (totals.total||1))*100)}% completed`,
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>,
              "bg-amber-100 dark:bg-amber-900/30"
            )}
            {statCard(
              "Total", 
              fmt(totals.total), 
              `${fmt(totals.paid)} paid`,
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>,
              "bg-emerald-100 dark:bg-emerald-900/30"
            )}
          </div>
        </motion.div>

        {/* Period Summary */}
        {summary && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Period</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">{summary.period}</div>
                  </div>
                  <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Total</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">{fmt(summary.totalCents)}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.values(summary.perMember).map((pm) => (
                    <div key={pm.name} className="text-center px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{pm.name}</div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">{fmt(pm.cents)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Room Invite Modal */}
      <RoomInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roomId={rid}
        roomName={room?.name || `Room #${rid}`}
      />
    </motion.div>
  );
};
