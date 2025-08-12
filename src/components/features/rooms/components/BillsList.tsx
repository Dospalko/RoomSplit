import React from 'react';
import { Bill, Member, fmt } from '../types';

interface BillsListProps {
  bills: Bill[];
  members: Member[];
  totals: {
    total: number;
    paid: number;
    outstanding: number;
  };
  onMarkPaid: (shareId: number, paid: boolean) => void;
  onDeleteBill: (billId: number) => void;
}

export const BillsList: React.FC<BillsListProps> = ({
  bills,
  members,
  totals,
  onMarkPaid,
  onDeleteBill
}) => {
  const memberNameById = React.useMemo(() => 
    members.reduce<Record<number, string>>((acc, m) => { 
      acc[m.id] = m.name; 
      return acc; 
    }, {}), 
    [members]
  );

  return (
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
                      <button 
                        onClick={() => onDeleteBill(b.id)} 
                        className="text-xs text-neutral-400 hover:text-red-600 transition" 
                        title="Delete bill"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <ul className="mt-5 grid md:grid-cols-2 gap-2">
                    {b.shares.map((s) => {
                      const displayName = s.member?.name || memberNameById[s.memberId] || `Member ${s.memberId}`;
                      return (
                        <li 
                          key={s.id} 
                          className={`group/share relative rounded-lg border flex items-center justify-between gap-3 px-3 py-2 text-xs sm:text-sm transition ${
                            s.paid 
                              ? "border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-500/10 dark:border-emerald-500/30" 
                              : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/40 hover:border-blue-400/60 hover:bg-blue-50/50 dark:hover:bg-blue-500/10"
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-medium">{displayName}</span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{fmt(s.amountCents)}</span>
                          </div>
                          {s.paid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.92a1 1 0 011.408-1.42l3.036 3.016 6.536-6.525a1 1 0 011.428 0z" clipRule="evenodd" />
                              </svg>
                              PAID
                            </span>
                          ) : (
                            <button 
                              onClick={() => onMarkPaid(s.id, true)} 
                              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-[10px] font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            >
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
  );
};
