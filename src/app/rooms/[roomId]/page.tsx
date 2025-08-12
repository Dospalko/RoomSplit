"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExpenseAnalytics, SkeletonLoader } from "@/components";

// Import all our new components and hooks
import { useRoomData } from "@/components/features/rooms/hooks/useRoomData";
import { useNotifications } from "@/components/features/rooms/hooks/useNotifications";
import { NotificationContainer } from "@/components/features/rooms/components/NotificationContainer";
import { RoomHeader } from "@/components/features/rooms/components/RoomHeader";
import { MembersCard } from "@/components/features/rooms/components/MembersCard";
import { NewBillCard } from "@/components/features/rooms/components/NewBillCard";
import { BillsList } from "@/components/features/rooms/components/BillsList";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const rid = Number(roomId);

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Initialize notifications
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Main data hook - handles all room data, authentication, and operations
  const {
    // Auth state
    authLoading,
    accessDenied,
    
    // Data state
    room,
    members,
    bills,
    summary,
    
    // Loading states
    loading,
    
    // Operations
    addMember,
    addBill,
    markPaid,
    deleteMember,
    deleteBill,
    deleteRoom
  } = useRoomData({ rid, period: currentPeriod, addNotification });

  // Handle authentication loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonLoader />
      </div>
    );
  }

  // Handle access denied
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don&apos;t have permission to access this room, or it doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SkeletonLoader />
      </div>
    );
  }

  // Calculate totals and stats for components
  const billTotals = bills.reduce((acc, bill) => {
    const totalAmount = bill.shares.reduce((sum, share) => sum + share.amountCents, 0);
    const paidAmount = bill.shares.filter(s => s.paid).reduce((sum, share) => sum + share.amountCents, 0);
    acc.total += totalAmount;
    acc.paid += paidAmount;
    acc.outstanding += totalAmount - paidAmount;
    acc.paidShares += bill.shares.filter(s => s.paid).length;
    return acc;
  }, { total: 0, paid: 0, outstanding: 0, paidShares: 0 });

  // Calculate per-member balance from summary
  const perMemberBalance = summary?.perMember ? 
    Object.fromEntries(
      Object.entries(summary.perMember).map(([key, value]) => [parseInt(key), value.cents])
    ) : {};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      <div className="space-y-10 pb-16">
        {/* Header */}
        <RoomHeader
          room={room}
          rid={rid}
          summary={summary}
          memberCount={members.length}
          billCount={bills.length}
          totals={billTotals}
          onDeleteRoom={deleteRoom}
          onViewAnalytics={() => setActiveTab('analytics')}
        />

        {/* Tab Navigation */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-6 py-4 shadow-sm mb-8">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Analytics
                {bills.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    {bills.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-4 order-2 lg:order-1">
              {/* Members Card */}
              <MembersCard
                members={members}
                perMemberBalance={perMemberBalance}
                onAddMember={addMember}
                onDeleteMember={deleteMember}
              />

              {/* New Bill Card */}
              <NewBillCard
                members={members}
                onAddBill={addBill}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              {/* Bills List */}
              <BillsList
                bills={bills}
                members={members}
                totals={billTotals}
                onMarkPaid={markPaid}
                onDeleteBill={deleteBill}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="mt-8">
            <ExpenseAnalytics members={members} bills={bills} />
          </div>
        )}
      </div>
    </div>
  );
}
