"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExpenseAnalytics } from "@/components";

import { useRoomData } from "@/components/features/rooms/hooks/useRoomData";
import { useNotifications } from "@/components/features/rooms/hooks/useNotifications";
import { NotificationContainer } from "@/components/features/rooms/components/NotificationContainer";
import { RoomHeader } from "@/components/features/rooms/components/RoomHeader";
import { MembersCard } from "@/components/features/rooms/components/MembersCard";
import { NewBillCard } from "@/components/features/rooms/components/NewBillCard";
import { BillsList } from "@/components/features/rooms/components/BillsList";
import { RoomAccessMembers } from "@/components/features/rooms/components/RoomAccessMembers";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const rid = Number(roomId);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const currentPeriod = new Date().toISOString().slice(0, 7);

  const { notifications, addNotification, removeNotification } = useNotifications();

  const {
    authLoading,
    accessDenied,
    room,
    members,
    bills,
    summary,
    addMember,
    addBill,
    markPaid,
    deleteMember,
    deleteBill,
    deleteRoom
  } = useRoomData({ rid, period: currentPeriod, addNotification });

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Loading Room</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Please wait while we fetch your room data...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (accessDenied && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border border-red-200 dark:border-red-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Access Denied</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            You don&apos;t have permission to access this room, or it doesn&apos;t exist. Please check the room ID or contact the room owner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="group relative px-6 py-3 text-sm font-semibold text-white overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Home</span>
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals and per-member balance
  const billTotals = bills.reduce((acc, bill) => {
    const totalAmount = bill.shares.reduce((sum, share) => sum + share.amountCents, 0);
    const paidAmount = bill.shares.filter(s => s.paid).reduce((sum, share) => sum + share.amountCents, 0);
    acc.total += totalAmount;
    acc.paid += paidAmount;
    acc.outstanding += totalAmount - paidAmount;
    acc.paidShares += bill.shares.filter(s => s.paid).length;
    return acc;
  }, { total: 0, paid: 0, outstanding: 0, paidShares: 0 });

  const perMemberBalance = summary?.perMember ? 
    Object.fromEntries(
      Object.entries(summary.perMember).map(([key, value]) => [parseInt(key), value.cents])
    ) : {};

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-200 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
            </svg>
            My Rooms
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            {room?.name || `Room #${rid}`}
          </span>
        </nav>

        <div className="space-y-8">
          {/* Header */}
          {room && (
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
          )}

          {/* Tab Navigation */}
          {room && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-2 shadow-sm">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`group relative flex-1 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      activeTab === 'overview' 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Overview</div>
                      <div className="text-xs opacity-70">Members & Bills</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`group relative flex-1 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === 'analytics'
                      ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      activeTab === 'analytics' 
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Analytics</span>
                        {bills.length > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-500 rounded-full">
                            {bills.length}
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-70">Insights & Reports</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {room && activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="space-y-6 xl:col-span-4">
                <RoomAccessMembers roomId={rid} />
                <MembersCard
                  members={members}
                  perMemberBalance={perMemberBalance}
                  onAddMember={addMember}
                  onDeleteMember={deleteMember}
                />
                <NewBillCard
                  members={members}
                  onAddBill={addBill}
                />
              </div>

              {/* Main Content Area */}
              <div className="xl:col-span-8">
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

          {/* Analytics */}
          {room && activeTab === 'analytics' && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              <ExpenseAnalytics members={members} bills={bills} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
