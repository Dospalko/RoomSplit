import React, { useState } from 'react';
import { Member, BillRule, BillMeta } from '../types';
import { CategoryTagSelector } from './CategoryTagSelector';

interface NewBillCardProps {
  members: Member[];
  roomId: number;
  onAddBill: (title: string, amount: string, period: string, rule: BillRule, meta: BillMeta | null, categoryId?: number, tagIds?: number[]) => Promise<void>;
}

export const NewBillCard: React.FC<NewBillCardProps> = ({ members, roomId, onAddBill }) => {
  const [title, setTitle] = useState("Electricity");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState("80");
  const [rule, setRule] = useState<BillRule>('EQUAL');
  const [percentMeta, setPercentMeta] = useState<Record<number, string>>({});
  const [weightMeta, setWeightMeta] = useState<Record<number, string>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let meta: BillMeta | null = null;

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

      await onAddBill(title, amount, period, rule, meta, selectedCategoryId, selectedTagIds);
      
      // Reset form
      setTitle("Electricity");
      setAmount("80");
      setPercentMeta({});
      setWeightMeta({});
      setSelectedCategoryId(undefined);
      setSelectedTagIds([]);
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
          
          {/* Category and Tags Section */}
          <div className="sm:col-span-2">
            <CategoryTagSelector
              roomId={roomId}
              selectedCategoryId={selectedCategoryId}
              selectedTagIds={selectedTagIds}
              onCategoryChange={setSelectedCategoryId}
              onTagsChange={setSelectedTagIds}
            />
          </div>
          
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-3 text-sm font-bold text-white overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 dark:hover:from-slate-50 dark:hover:via-white dark:hover:to-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-900/25 dark:hover:shadow-white/25 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Create ({rule.toLowerCase()}) split</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
