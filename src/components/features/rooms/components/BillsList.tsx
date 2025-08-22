import React from 'react';
import { Bill, Member, fmt } from '@/types';
import { BillCard } from './BillCard';

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
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              memberNameById={memberNameById}
              onMarkPaid={onMarkPaid}
              onDeleteBill={onDeleteBill}
            />
          ))}
        </div>
      )}
    </div>
  );
};
