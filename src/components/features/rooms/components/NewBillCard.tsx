import React, { useState } from 'react';
import { Member, BillRule, BillMeta } from '../types';

interface NewBillCardProps {
  members: Member[];
  onAddBill: (title: string, amount: string, period: string, rule: BillRule, meta: BillMeta) => Promise<void>;
}

export const NewBillCard: React.FC<NewBillCardProps> = ({ members, onAddBill }) => {
  const [title, setTitle] = useState("Electricity");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState("80");
  const [rule, setRule] = useState<BillRule>('EQUAL');
  const [percentMeta, setPercentMeta] = useState<Record<number, string>>({});
  const [weightMeta, setWeightMeta] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let meta: BillMeta = null;

      if (rule === 'PERCENT') {
        const percents: Record<number, number> = {};
        for (const m of members) {
          percents[m.id] = Number(percentMeta[m.id] || 0);
        }
        meta = { percents };
      } else if (rule === 'WEIGHT') {
        const weights: Record<number, number> = {};
        for (const m of members) {
          weights[m.id] = Number(weightMeta[m.id] || 0);
        }
        meta = { weights };
      }

      await onAddBill(title, amount, period, rule, meta);
      
      // Reset form
      setTitle("Electricity");
      setAmount("80");
      setPercentMeta({});
      setWeightMeta({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">New Bill</h2>
      </div>
      <div className="px-5 pb-5">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Title</label>
            <input 
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Electricity"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Period (YYYY-MM)</label>
            <input 
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)} 
              placeholder="2025-08"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Amount (€)</label>
            <input 
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="80"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Rule</label>
            <select 
              value={rule} 
              onChange={(e) => setRule(e.target.value as BillRule)} 
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
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
                        onChange={(e) => setPercentMeta(p => ({ ...p, [m.id]: e.target.value }))}
                        className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
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
                        onChange={(e) => setWeightMeta(p => ({ ...p, [m.id]: e.target.value }))}
                        className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg py-2.5 text-sm font-medium bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 text-white dark:text-neutral-900 shadow hover:shadow-md active:scale-[.985] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Creating...' : `Create (${rule.toLowerCase()}) split`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
