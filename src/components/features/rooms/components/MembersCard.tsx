import React, { useState } from 'react';
import { Member, fmt } from '../types';
import { validateMemberName } from '../hooks/useValidation';

interface MembersCardProps {
  members: Member[];
  perMemberBalance: Record<number, number>;
  onAddMember: (name: string) => Promise<void>;
  onDeleteMember: (memberId: number) => void;
}

export const MembersCard: React.FC<MembersCardProps> = ({
  members,
  perMemberBalance,
  onAddMember,
  onDeleteMember
}) => {
  const [memberName, setMemberName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddMember(memberName.trim());
      setMemberName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationError = memberName.trim() ? validateMemberName(memberName, members) : null;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">Members</h2>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          {members.length}
        </span>
      </div>
      <div className="px-5 pb-5">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Name</label>
            <input
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                validationError
                  ? 'border-red-300 dark:border-red-700 bg-red-50/70 dark:bg-red-950/40 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Alice"
              disabled={isSubmitting}
            />
            {validationError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {validationError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !!validationError}
            className="group relative px-6 py-2 text-sm font-semibold text-white overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600 disabled:from-neutral-400 disabled:via-neutral-500 disabled:to-neutral-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add</span>
                </>
              )}
            </div>
          </button>
        </form>
        <ul className="mt-5 grid sm:grid-cols-1 gap-2 max-h-72 overflow-auto pr-1">
          {members.length === 0 && (
            <li className="text-xs text-neutral-500">No members yet.</li>
          )}
          {members.map((m) => {
            const balance = perMemberBalance[m.id] || 0;
            const badge = balance > 0 ? `${fmt(balance)} due` : "clear";
            return (
              <li 
                key={m.id} 
                className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2 flex items-center justify-between text-sm hover:border-blue-400/60 hover:bg-blue-50/70 dark:hover:bg-blue-500/10 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold shadow-inner">
                    {m.name.slice(0,2).toUpperCase()}
                  </div>
                  <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">{m.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full ml-3 shrink-0 ${
                    balance > 0 
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" 
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  }`}>
                    {badge}
                  </span>
                  <button 
                    onClick={() => onDeleteMember(m.id)} 
                    className="group/delete relative opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 flex items-center justify-center" 
                    title="Delete member"
                  >
                    <svg className="w-3 h-3 group-hover/delete:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
