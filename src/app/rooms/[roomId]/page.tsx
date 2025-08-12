"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExpenseAnalytics, SkeletonLoader } from "@/components";

// Domain types
type Member = { id: number; name: string };
type Share = { id: number; memberId: number; amountCents: number; paid: boolean; member?: { id: number; name: string } };
type BillRule = 'EQUAL' | 'PERCENT' | 'WEIGHT';
type BillMeta = { percents?: Record<string, number>; weights?: Record<string, number> } | null;
type Bill = { id: number; title: string; amountCents: number; period: string; shares: Share[]; rule?: BillRule; meta?: BillMeta };
type User = { id: number; email: string; name: string };
type Room = { id: number; name: string };

// Notification types
type NotificationType = 'success' | 'error' | 'warning' | 'info';
type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
};

const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const rid = Number(roomId);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // State
  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [memberName, setMemberName] = useState("");
  const [title, setTitle] = useState("Electricity");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState("80");
  const [summary, setSummary] = useState<{ period: string; totalCents: number; perMember: Record<string, { name: string; cents: number }> } | null>(null);
  const [rule, setRule] = useState<BillRule>('EQUAL');
  const [percentMeta, setPercentMeta] = useState<Record<number, string>>({});
  const [weightMeta, setWeightMeta] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const welcomeShownRef = useRef(false);

  // Notification system
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification utility functions
  const addNotification = useCallback((type: NotificationType, title: string, message: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, type, title, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Helper function to handle API errors
  const handleApiError = useCallback((error: unknown, fallbackMessage: string) => {
    console.error(fallbackMessage, error);
    const message = error instanceof Error ? error.message : fallbackMessage;
    addNotification('error', 'Error', message);
  }, [addNotification]);

  // Validation functions
  const validateMemberName = (name: string): string | null => {
    if (!name.trim()) return "Member name is required";
    if (name.trim().length < 2) return "Member name must be at least 2 characters";
    if (name.trim().length > 50) return "Member name must be less than 50 characters";
    if (members.some(m => m.name.toLowerCase() === name.trim().toLowerCase())) return "Member with this name already exists";
    return null;
  };

  const validateBillData = (title: string, amount: string, period: string): string | null => {
    if (!title.trim()) return "Bill title is required";
    if (title.trim().length < 2) return "Bill title must be at least 2 characters";
    if (title.trim().length > 120) return "Bill title must be less than 120 characters";
    
    const amountNum = Number(amount);
    if (!amount.trim()) return "Amount is required";
    if (isNaN(amountNum) || amountNum <= 0) return "Amount must be a positive number";
    if (amountNum > 999999) return "Amount cannot exceed €999,999";
    
    if (!period.trim()) return "Period is required";
    if (!period.match(/^\d{4}-\d{2}$/)) return "Period must be in YYYY-MM format";
    
    if (members.length === 0) return "Add at least one member before creating bills";
    
    return null;
  };

  const validatePercentages = (): string | null => {
    let sum = 0;
    const memberCount = members.length;
    let filledCount = 0;
    
    for (const m of members) {
      const value = percentMeta[m.id];
      if (value !== undefined && value !== '') {
        const num = Number(value);
        if (isNaN(num) || num < 0) return `Invalid percentage for ${m.name}`;
        if (num > 100) return `Percentage for ${m.name} cannot exceed 100%`;
        sum += num;
        filledCount++;
      }
    }
    
    if (filledCount === 0) return "Please enter percentages for at least one member";
    if (filledCount < memberCount) return "Please enter percentages for all members";
    if (Math.abs(sum - 100) > 0.01) return `Percentages must sum to 100% (currently ${sum.toFixed(2)}%)`;
    
    return null;
  };

  const validateWeights = (): string | null => {
    let sum = 0;
    let filledCount = 0;
    
    for (const m of members) {
      const value = weightMeta[m.id];
      if (value !== undefined && value !== '') {
        const num = Number(value);
        if (isNaN(num) || num < 0) return `Invalid weight for ${m.name}`;
        if (num > 1000) return `Weight for ${m.name} cannot exceed 1000`;
        sum += num;
        filledCount++;
      }
    }
    
    if (filledCount === 0) return "Please enter weights for at least one member";
    if (sum <= 0) return "Total weight must be greater than 0";
    
    return null;
  };

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Not authenticated, redirect to home
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/');
        return;
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Derived maps & aggregates
  const memberNameById = useMemo(() => members.reduce<Record<number, string>>((acc, m) => { acc[m.id] = m.name; return acc; }, {}), [members]);

  const totals = useMemo(() => {
    let total = 0, paid = 0, outstanding = 0, sharesCount = 0, paidShares = 0;
    for (const b of bills) {
      total += b.amountCents;
      for (const s of b.shares) {
        sharesCount++;
        if (s.paid) { paid += s.amountCents; paidShares++; } else outstanding += s.amountCents;
      }
    }
    return { total, paid, outstanding, sharesCount, paidShares };
  }, [bills]);

  const perMemberBalance = useMemo(() => {
    // Positive => still needs to pay; Negative => overpaid (not tracked yet here, just unpaid sum)
    const map: Record<number, number> = {};
    for (const m of members) map[m.id] = 0;
    for (const b of bills) {
      for (const s of b.shares) {
        if (!s.paid) map[s.memberId] = (map[s.memberId] || 0) + s.amountCents;
      }
    }
    return map;
  }, [bills, members]);

  // Data loader with authentication
  const load = useCallback(async () => {
    if (!Number.isFinite(rid) || authLoading) return;
    setLoading(true);
    try {
      const [roomData, m, b, s] = await Promise.all([
        fetch(`/api/rooms/${rid}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }).then(async (r) => {
          if (r.status === 401 || r.status === 403) {
            setAccessDenied(true);
            router.push('/');
            throw new Error('Access denied');
          }
          if (!r.ok) {
            const errorData = await r.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch room');
          }
          return r.json();
        }),
        fetch(`/api/rooms/${rid}/members`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }).then(async (r) => {
          if (r.status === 401 || r.status === 403) {
            setAccessDenied(true);
            router.push('/');
            throw new Error('Access denied');
          }
          if (!r.ok) {
            const errorData = await r.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch members');
          }
          return r.json();
        }),
        fetch(`/api/rooms/${rid}/bills`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(async (r) => {
          console.log('Bills API response status:', r.status);
          if (r.status === 401 || r.status === 403) {
            setAccessDenied(true);
            router.push('/');
            throw new Error('Access denied');
          }
          if (!r.ok) {
            const errorData = await r.json().catch(() => ({}));
            console.error('Bills API error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch bills');
          }
          return r.json();
        }),
        fetch(`/api/rooms/${rid}/summary?period=${period}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }).then(async (r) => {
          if (r.status === 401 || r.status === 403) {
            return null; // Summary is optional
          }
          if (!r.ok) return null;
          return r.json();
        }).catch(() => null),
      ]);
      
      setRoom(roomData);
      setMembers(m);
      setBills(b);
      setSummary(s && !s.error ? s : null);
      setLoading(false);
      
      // Welcome notification only on first load
      if (roomData?.name && !welcomeShownRef.current) {
        addNotification('info', 'Welcome!', `You're now managing "${roomData.name}"`, 3000);
        welcomeShownRef.current = true;
      }
    } catch (error) {
      console.error('Failed to load room data:', error);
      if (error instanceof Error && error.message !== 'Access denied') {
        addNotification('error', 'Failed to Load Data', error.message);
      }
      setLoading(false);
    }
  }, [rid, period, authLoading, router, addNotification]);

  useEffect(() => { 
    if (!authLoading && user) {
      load(); 
    }
  }, [load, authLoading, user]);

  // Actions
  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const error = validateMemberName(memberName);
    if (error) {
      addNotification('error', 'Invalid Member Name', error);
      return;
    }

    try {
      const res = await fetch(`/api/rooms/${rid}/members`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ name: memberName.trim() }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      setMemberName("");
      addNotification('success', 'Member Added', `${memberName.trim()} has been added successfully!`);
      load();
    } catch (error) {
      console.error('Failed to add member:', error);
      addNotification('error', 'Failed to Add Member', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const basicError = validateBillData(title, amount, period);
    if (basicError) {
      addNotification('error', 'Invalid Bill Data', basicError);
      return;
    }

    const amountNum = Number(amount);
    let meta: BillMeta = null;

    // Rule-specific validation
    if (rule === 'PERCENT') {
      const percentError = validatePercentages();
      if (percentError) {
        addNotification('error', 'Invalid Percentages', percentError);
        return;
      }

      // Build percents map
      const percents: Record<number, number> = {};
      for (const m of members) {
        percents[m.id] = Number(percentMeta[m.id] || 0);
      }
      meta = { percents };
    } else if (rule === 'WEIGHT') {
      const weightError = validateWeights();
      if (weightError) {
        addNotification('error', 'Invalid Weights', weightError);
        return;
      }

      // Build weights map
      const weights: Record<number, number> = {};
      for (const m of members) {
        weights[m.id] = Number(weightMeta[m.id] || 0);
      }
      meta = { weights };
    }

    try {
      const res = await fetch(`/api/rooms/${rid}/bills`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          title: title.trim(), 
          amount: amountNum, 
          period, 
          rule, 
          meta 
        }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      addNotification('success', 'Bill Created', `${title.trim()} bill created successfully with ${rule.toLowerCase()} split!`);
      
      // Reset form
      setTitle("Electricity");
      setAmount("80");
      setPercentMeta({});
      setWeightMeta({});
      
      load();
    } catch (error) {
      console.error('Failed to create bill:', error);
      addNotification('error', 'Failed to Create Bill', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const markPaid = async (shareId: number, paid: boolean) => {
    try {
      const res = await fetch(`/api/shares/${shareId}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ paid }),
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      addNotification('success', 'Payment Updated', `Share marked as ${paid ? 'paid' : 'unpaid'}!`);
      load();
    } catch (error) {
      console.error('Failed to update payment:', error);
      addNotification('error', 'Failed to Update Payment', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const deleteMember = async (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    if (!confirm(`Delete member "${member.name}"? Their shares will also be removed.`)) return;

    try {
      const res = await fetch(`/api/rooms/${rid}/members/${memberId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      addNotification('success', 'Member Deleted', `${member.name} has been removed from the room.`);
      load();
    } catch (error) {
      console.error('Failed to delete member:', error);
      addNotification('error', 'Failed to Delete Member', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const deleteBill = async (billId: number) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    if (!confirm(`Delete bill "${bill.title}" and all its shares?`)) return;

    try {
      const res = await fetch(`/api/rooms/${rid}/bills/${billId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      addNotification('success', 'Bill Deleted', `${bill.title} bill has been deleted.`);
      load();
    } catch (error) {
      console.error('Failed to delete bill:', error);
      addNotification('error', 'Failed to Delete Bill', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const deleteRoom = async () => {
    if (!confirm("Delete entire room (irreversible)?")) return;

    try {
      const res = await fetch(`/api/rooms?id=${rid}`, { 
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      addNotification('success', 'Room Deleted', 'Room has been permanently deleted.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Failed to delete room:', error);
      addNotification('error', 'Failed to Delete Room', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Show authentication loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show access denied
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

  // Show main content only if authenticated
  if (!user) {
    return null;
  }

  // UI helpers
  const statCard = (label: string, value: string, extra?: string, accent?: string) => (
    <div className={`relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm p-4 shadow-sm group`}>      
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium mb-1">{label}</div>
      <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</div>
      {extra && <div className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">{extra}</div>}
      <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accent || "from-blue-100/60 via-transparent to-transparent dark:from-blue-500/10"}`}></div>
    </div>
  );

  // Notification component
  const NotificationContainer = () => (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full rounded-lg border backdrop-blur-sm shadow-lg p-4 ${
            notification.type === 'success' 
              ? 'bg-emerald-50/90 dark:bg-emerald-900/60 border-emerald-200 dark:border-emerald-700' 
              : notification.type === 'error'
              ? 'bg-red-50/90 dark:bg-red-900/60 border-red-200 dark:border-red-700'
              : notification.type === 'warning'
              ? 'bg-amber-50/90 dark:bg-amber-900/60 border-amber-200 dark:border-amber-700'
              : 'bg-blue-50/90 dark:bg-blue-900/60 border-blue-200 dark:border-blue-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${
                notification.type === 'success' 
                  ? 'text-emerald-800 dark:text-emerald-200' 
                  : notification.type === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : notification.type === 'warning'
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-xs mt-1 ${
                notification.type === 'success' 
                  ? 'text-emerald-700 dark:text-emerald-300' 
                  : notification.type === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : notification.type === 'warning'
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                notification.type === 'success' 
                  ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-800' 
                  : notification.type === 'error'
                  ? 'text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800'
                  : notification.type === 'warning'
                  ? 'text-amber-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-800'
                  : 'text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <NotificationContainer />
      <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950 px-6 py-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {room?.name || `Room #${rid}`}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={deleteRoom} className="text-xs rounded-md border border-red-300/50 dark:border-red-700/40 text-red-600 dark:text-red-400 px-3 py-1 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition">Delete room</button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-prose">
              Sleduj členov, vytváraj účty a označuj platby. Elegantné rozdelenie nákladov v reálnom čase.
            </p>
            {summary && (
              <div className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm px-4 py-3 text-xs md:text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Period: <b>{summary.period}</b> • Total: <b>{fmt(summary.totalCents)}</b>
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-x-3 gap-y-1">
                  {Object.values(summary.perMember).map((pm) => (
                    <span key={pm.name}>{pm.name}: {fmt(pm.cents)}</span>
                  ))}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[260px] md:min-w-[520px]">
            {statCard("Members", String(members.length))}
            {statCard("Bills", String(bills.length))}
            {statCard("Outstanding", fmt(totals.outstanding), `${(totals.paidShares && Math.round((totals.paid / (totals.total||1))*100)) || 0}% paid`, "from-amber-100/70 dark:from-amber-500/20")}
            {statCard("Total", fmt(totals.total), `${fmt(totals.paid)} paid`, "from-emerald-100/70 dark:from-emerald-500/20")}
            {bills.length > 0 && (
              <div className="sm:col-span-2 md:col-span-4 mt-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="w-full group relative overflow-hidden rounded-xl border border-blue-200/50 dark:border-blue-700/40 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>View Analytics Dashboard</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      </div>

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

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        /* Overview Tab - Original Content */
        <>
          {loading ? (
            <div className="space-y-8">
              <SkeletonLoader type="analytics" count={1} />
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-8">
                  <SkeletonLoader type="card" count={2} />
                </div>
                <div className="lg:col-span-8">
                  <SkeletonLoader type="list" count={3} />
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left column: Members + New Bill */}
        <div className="space-y-8 lg:col-span-4 order-2 lg:order-1">
          {/* Members Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">Members</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">{members.length}</span>
            </div>
            <div className="px-5 pb-5">
              <form onSubmit={addMember} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Name</label>
                  <input
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      memberName.trim() && validateMemberName(memberName) 
                        ? 'border-red-300 dark:border-red-700 bg-red-50/70 dark:bg-red-950/40 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Alice"
                  />
                  {memberName.trim() && validateMemberName(memberName) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {validateMemberName(memberName)}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </form>
              <ul className="mt-5 grid sm:grid-cols-1 gap-2 max-h-72 overflow-auto pr-1">
                {members.length === 0 && <li className="text-xs text-neutral-500">No members yet.</li>}
                {members.map((m) => {
                  const balance = perMemberBalance[m.id] || 0;
                  const badge = balance > 0 ? `${fmt(balance)} due` : "clear";
                  return (
                    <li key={m.id} className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2 flex items-center justify-between text-sm hover:border-blue-400/60 hover:bg-blue-50/70 dark:hover:bg-blue-500/10 transition">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold shadow-inner">
                          {m.name.slice(0,2).toUpperCase()}
                        </div>
                        <span className="truncate font-medium text-neutral-800 dark:text-neutral-100">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full ml-3 shrink-0 ${balance>0 ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"}`}>{badge}</span>
                        <button onClick={() => deleteMember(m.id)} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-600 transition text-xs px-1" title="Delete member">✕</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* New Bill Card */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">New Bill</h2>
            </div>
            <div className="px-5 pb-5">
              <form onSubmit={addBill} className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Title</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Electricity" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Period (YYYY-MM)</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="2025-08" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Amount (€)</label>
                  <input className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="80" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-400">Rule</label>
                  <select value={rule} onChange={(e)=>setRule(e.target.value as BillRule)} className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
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
                              onChange={(e)=> setPercentMeta(p => ({ ...p, [m.id]: e.target.value }))}
                              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"/>
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
                              onChange={(e)=> setWeightMeta(p => ({ ...p, [m.id]: e.target.value }))}
                              className="w-20 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-950/40 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"/>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-lg py-2.5 text-sm font-medium bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 text-white dark:text-neutral-900 shadow hover:shadow-md active:scale-[.985] transition"
                  >
                    Create ({rule.toLowerCase()}) split
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Bills */}
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
                          <button onClick={() => deleteBill(b.id)} className="text-xs text-neutral-400 hover:text-red-600 transition" title="Delete bill">Delete</button>
                        </div>
                      </div>
                      <ul className="mt-5 grid md:grid-cols-2 gap-2">
                        {b.shares.map((s) => {
                          const displayName = s.member?.name || memberNameById[s.memberId] || `Member ${s.memberId}`;
                          return (
                            <li key={s.id} className={`group/share relative rounded-lg border flex items-center justify-between gap-3 px-3 py-2 text-xs sm:text-sm transition ${s.paid ? "border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-500/10 dark:border-emerald-500/30" : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/40 hover:border-blue-400/60 hover:bg-blue-50/50 dark:hover:bg-blue-500/10"}`}>
                              <div className="flex flex-col min-w-0">
                                <span className="truncate font-medium">{displayName}</span>
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{fmt(s.amountCents)}</span>
                              </div>
                              {s.paid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.92a1 1 0 011.408-1.42l3.036 3.016 6.536-6.525a1 1 0 011.428 0z" clipRule="evenodd" /></svg>
                                  PAID
                                </span>
                              ) : (
                                <button onClick={() => markPaid(s.id, true)} className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-[10px] font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
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
      </div>
            </>
          )}
        </>
      ) : (
        /* Analytics Tab */
        <ExpenseAnalytics members={members} bills={bills} />
      )}
      
    </div>
    </>
  );
}
