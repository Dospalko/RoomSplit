import { useState, useEffect } from 'react';

interface AccessMember {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinedAt: string | null;
}

interface RoomAccessData {
  roomName: string;
  accessMembers: AccessMember[];
}

interface RoomAccessMembersProps {
  roomId: number;
}

export function RoomAccessMembers({ roomId }: RoomAccessMembersProps) {
  const [accessData, setAccessData] = useState<RoomAccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccessMembers = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/access`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch access members');
          return;
        }

        const data = await response.json();
        setAccessData(data);
      } catch (error) {
        console.error('Error fetching access members:', error);
        setError('Failed to load access members');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessMembers();
  }, [roomId]);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-900/20 dark:via-slate-800 dark:to-red-950/20 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">Unable to Load</h3>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!accessData) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 p-6 shadow-sm">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full -translate-y-16 translate-x-16" />
      
      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Room Access
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {accessData.accessMembers.length} active {accessData.accessMembers.length === 1 ? 'member' : 'members'}
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="relative space-y-4">
        {accessData.accessMembers.map((member, index) => (
          <div key={member.id} className="group flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300">
            {/* Avatar */}
            <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
              member.role === 'owner' 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/25' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25'
            }`}>
              {member.name.charAt(0).toUpperCase()}
              
              {/* Role badge */}
              {member.role === 'owner' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                  {member.name}
                </h4>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  member.role === 'owner'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                }`}>
                  {member.role}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {member.email}
              </p>
              {member.joinedAt && (
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Member number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Room: <span className="font-semibold text-slate-900 dark:text-white">{accessData.roomName}</span>
          </span>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
