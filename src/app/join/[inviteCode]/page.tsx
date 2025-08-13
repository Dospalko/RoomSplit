"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface InviteDetails {
  valid: boolean;
  room: {
    name: string;
    owner: string;
  };
  invite: {
    expiresAt: string;
    usedCount: number;
    maxUses: number | null;
    isActive: boolean;
  };
  error?: string;
}

export default function JoinRoomPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const router = useRouter();
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!inviteCode) return;

    const fetchInviteDetails = async () => {
      try {
        const response = await fetch(`/api/join/${inviteCode}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch invite details');
          return;
        }

        const data = await response.json();
        setInviteDetails(data);
      } catch (error) {
        console.error('Error fetching invite details:', error);
        setError('Failed to load invite details');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [inviteCode]);

  const joinRoom = async () => {
    setJoining(true);
    setError('');

    try {
      const response = await fetch(`/api/join/${inviteCode}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join room');
      }

      const data = await response.json();
      
      // Redirect to the room
      router.push(`/rooms/${data.room.id}`);
    } catch (error: unknown) {
      console.error('Error joining room:', error);
      setError(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading invite details...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-red-900 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invalid Invite</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || 'This invite link is not valid or has expired.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!inviteDetails.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-amber-900 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invite Expired</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {inviteDetails.error || 'This invite is no longer valid.'}
          </p>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            <p>Room: <strong>{inviteDetails.room.name}</strong></p>
            <p>Owner: <strong>{inviteDetails.room.owner}</strong></p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10 3h4l3 3H7l3-3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Join Room
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Youve been invited to join a shared expense room
            </p>
          </div>

          {/* Room Details */}
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {inviteDetails.room.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Owned by <strong>{inviteDetails.room.owner}</strong>
            </p>
            
            {/* Invite Details */}
            <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <p>Expires: {new Date(inviteDetails.invite.expiresAt).toLocaleDateString()}</p>
              {inviteDetails.invite.maxUses && (
                <p>
                  Uses: {inviteDetails.invite.usedCount} / {inviteDetails.invite.maxUses}
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Join Button */}
          <button
            onClick={joinRoom}
            disabled={joining}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {joining ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining Room...
              </div>
            ) : (
              'Join Room'
            )}
          </button>

          {/* Cancel */}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
