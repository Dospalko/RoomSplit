'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Room } from '@/types';

export default function SimpleHeader() {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);

  // Fetch room data when roomId changes
  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        try {
          const res = await fetch(`/api/rooms/${roomId}`);
          if (res.ok) {
            const roomData = await res.json();
            setRoom(roomData);
          }
        } catch (error) {
          console.error('Failed to fetch room:', error);
        }
      };
      
      fetchRoom();
    } else {
      setRoom(null);
    }
  }, [roomId]);

  return (
    <>
      {/* Subtle background glow */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none z-40" />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-black/70 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-lg shadow-black/5">
        <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo/Brand with enhanced styling */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-20 blur-md group-hover:blur-lg transition-all duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 transition-all duration-500 transform group-hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent font-space-mono">
                RoomSplit
              </span>
              {roomId && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-roboto-mono font-medium tracking-wider">
                  {room?.name || `Room #${roomId}`}
                </span>
              )}
            </div>
          </Link>

          {/* Enhanced Navigation */}
          <nav className="flex items-center gap-6">
            {/* Room indicator with subtle styling */}
            {roomId && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/20">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 font-roboto-mono">
                  Active Room
                </span>
              </div>
            )}
            
            {/* Back to Home button with enhanced styling */}
            <Link 
              href="/"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-600/50 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md font-roboto-mono"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Home</span>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md" />
            </Link>
          </nav>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" />
          <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-bounce delay-300 opacity-30" />
        </div>
      </header>
    </>
  );
}
