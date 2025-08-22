'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { fmt } from '@/types';
import type { Member, Bill } from '@/types';

interface ExpenseAnalyticsProps {
  members: Member[];
  bills: Bill[];
}

interface MonthlyData {
  period: string;
  total: number;
  paid: number;
  unpaid: number;
  billCount: number;
}

interface CategoryData {
  name: string;
  value: number;
  count: number;
}

export default function ExpenseAnalytics({ members, bills }: ExpenseAnalyticsProps) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    // Member contribution analysis
    const memberSpending = members.map(member => {
      const memberShares = bills.flatMap(bill => 
        bill.shares.filter(share => share.memberId === member.id)
      );
      const totalAmount = memberShares.reduce((sum, share) => sum + share.amountCents, 0);
      const paidAmount = memberShares.filter(share => share.paid).reduce((sum, share) => sum + share.amountCents, 0);
      const unpaidAmount = totalAmount - paidAmount;
      
      return {
        name: member.name,
        total: totalAmount,
        paid: paidAmount,
        unpaid: unpaidAmount,
        percentage: bills.length > 0 ? (totalAmount / bills.reduce((sum, bill) => sum + bill.amountCents, 0)) * 100 : 0
      };
    });

    // Monthly spending trends
    const monthlyData = bills.reduce((acc, bill) => {
      const month = bill.period;
      if (!acc[month]) {
        acc[month] = { period: month, total: 0, paid: 0, unpaid: 0, billCount: 0 };
      }
      acc[month].total += bill.amountCents;
      acc[month].billCount += 1;
      
      const paidAmount = bill.shares.filter(share => share.paid).reduce((sum, share) => sum + share.amountCents, 0);
      acc[month].paid += paidAmount;
      acc[month].unpaid += (bill.amountCents - paidAmount);
      
      return acc;
    }, {} as Record<string, MonthlyData>);

    const monthlyTrends = Object.values(monthlyData).sort((a: MonthlyData, b: MonthlyData) => a.period.localeCompare(b.period));

    // Payment status overview
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amountCents, 0);
    const totalPaid = bills.flatMap(bill => bill.shares).filter(share => share.paid).reduce((sum, share) => sum + share.amountCents, 0);
    const totalUnpaid = totalAmount - totalPaid;

    const paymentStatus = [
      { name: 'Paid', value: totalPaid, color: '#10B981' },
      { name: 'Unpaid', value: totalUnpaid, color: '#F59E0B' }
    ];

    // Bill categories (simplified by title keywords)
    const categoryData = bills.reduce((acc, bill) => {
      let category = 'Other';
      const title = bill.title.toLowerCase();
      
      if (title.includes('rent') || title.includes('housing')) category = 'Housing';
      else if (title.includes('food') || title.includes('grocery') || title.includes('restaurant')) category = 'Food';
      else if (title.includes('electric') || title.includes('gas') || title.includes('water') || title.includes('utility')) category = 'Utilities';
      else if (title.includes('transport') || title.includes('uber') || title.includes('gas')) category = 'Transport';
      else if (title.includes('entertainment') || title.includes('movie') || title.includes('game')) category = 'Entertainment';
      
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      acc[category].value += bill.amountCents;
      acc[category].count += 1;
      
      return acc;
    }, {} as Record<string, CategoryData>);

    return {
      memberSpending,
      monthlyTrends,
      paymentStatus,
      categoryData: Object.values(categoryData),
      totalStats: {
        totalAmount,
        totalPaid,
        totalUnpaid,
        billCount: bills.length,
        memberCount: members.length
      }
    };
  }, [members, bills]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl">
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {typeof entry.value === 'number' ? fmt(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; color: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{data.name}</p>
          <p className="text-sm font-medium" style={{ color: data.color }}>
            {fmt(data.value)} ({((data.value / analytics.totalStats.totalAmount) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (bills.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 opacity-50">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Data Available</h3>
        <p className="text-slate-600 dark:text-slate-400">Create some bills to see beautiful analytics and insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Analytics Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Insights into your expense patterns and trends</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Live Data</span>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6 hover:bg-white/90 dark:hover:bg-slate-900/80 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fmt(analytics.totalStats.totalAmount)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Expenses</div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6 hover:bg-white/90 dark:hover:bg-slate-900/80 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fmt(analytics.totalStats.totalPaid)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Paid</div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6 hover:bg-white/90 dark:hover:bg-slate-900/80 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fmt(analytics.totalStats.totalUnpaid)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Outstanding</div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6 hover:bg-white/90 dark:hover:bg-slate-900/80 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analytics.totalStats.billCount}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Bills</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Member Contributions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Member Contributions</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.memberSpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => fmt(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="paid" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="unpaid" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Status */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Payment Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.paymentStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent?: number }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {analytics.paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        {analytics.monthlyTrends.length > 1 && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Monthly Spending Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => fmt(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="paid" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {analytics.categoryData.length > 0 && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Expense Categories</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(value) => fmt(value)} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
