import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Room, Member, Bill, RoomSummary, User, BillRule, BillMeta } from '../types';
import { 
  validateMemberName, 
  validateBillData, 
  validatePercentages, 
  validateWeights 
} from './useValidation';

interface UseRoomDataProps {
  rid: number;
  period: string;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number) => void;
}

export const useRoomData = ({ rid, period, addNotification }: UseRoomDataProps) => {
  const router = useRouter();
  const welcomeShownRef = useRef(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Room data
  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<RoomSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
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

  // Data loader
  const load = useCallback(async () => {
    if (!Number.isFinite(rid) || authLoading) return;
    
    // Only show loading spinner on initial load, not on subsequent refreshes
    if (!hasInitiallyLoaded) {
      setLoading(true);
    }
    
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
          headers: { 'Content-Type': 'application/json' },
        }).then(async (r) => {
          if (r.status === 401 || r.status === 403) {
            setAccessDenied(true);
            router.push('/');
            throw new Error('Access denied');
          }
          if (!r.ok) {
            const errorData = await r.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch bills');
          }
          return r.json();
        }),
        fetch(`/api/rooms/${rid}/summary?period=${period}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }).then(async (r) => {
          if (r.status === 401 || r.status === 403) {
            return null;
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
      setHasInitiallyLoaded(true);
      
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
      setHasInitiallyLoaded(true);
    }
  }, [rid, period, authLoading, router, addNotification, hasInitiallyLoaded]);

  useEffect(() => { 
    if (!authLoading && user) {
      load(); 
    }
  }, [load, authLoading, user]);

  // Actions
  const addMember = async (name: string) => {
    const error = validateMemberName(name, members);
    if (error) {
      addNotification('error', 'Invalid Member Name', error);
      throw new Error(error);
    }

    const res = await fetch(`/api/rooms/${rid}/members`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ name: name.trim() }),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Add Member', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Member Added', `${name.trim()} has been added successfully!`);
    load();
  };

  const addBill = async (title: string, amount: string, period: string, rule: BillRule, meta: BillMeta) => {
    const basicError = validateBillData(title, amount, period, members);
    if (basicError) {
      addNotification('error', 'Invalid Bill Data', basicError);
      throw new Error(basicError);
    }

    // Rule-specific validation
    if (rule === 'PERCENT') {
      const percentError = validatePercentages(meta?.percents || {}, members);
      if (percentError) {
        addNotification('error', 'Invalid Percentages', percentError);
        throw new Error(percentError);
      }
    } else if (rule === 'WEIGHT') {
      const weightError = validateWeights(meta?.weights || {}, members);
      if (weightError) {
        addNotification('error', 'Invalid Weights', weightError);
        throw new Error(weightError);
      }
    }

    const amountNum = Number(amount);
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
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Create Bill', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Bill Created', `${title.trim()} bill created successfully with ${rule.toLowerCase()} split!`);
    load();
  };

  const markPaid = async (shareId: number, paid: boolean) => {
    const res = await fetch(`/api/shares/${shareId}`, { 
      method: "PATCH", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ paid }),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Update Payment', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Payment Updated', `Share marked as ${paid ? 'paid' : 'unpaid'}!`);
    load();
  };

  const deleteMember = async (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    if (!confirm(`Delete member "${member.name}"? Their shares will also be removed.`)) return;

    const res = await fetch(`/api/rooms/${rid}/members/${memberId}`, { 
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Delete Member', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Member Deleted', `${member.name} has been removed from the room.`);
    load();
  };

  const deleteBill = async (billId: number) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    if (!confirm(`Delete bill "${bill.title}" and all its shares?`)) return;

    const res = await fetch(`/api/rooms/${rid}/bills/${billId}`, { 
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Delete Bill', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Bill Deleted', `${bill.title} bill has been deleted.`);
    load();
  };

  const deleteRoom = async () => {
    if (!confirm("Delete entire room (irreversible)?")) return;

    const res = await fetch(`/api/rooms?id=${rid}`, { 
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error || `Server error: ${res.status}`;
      addNotification('error', 'Failed to Delete Room', errorMessage);
      throw new Error(errorMessage);
    }

    addNotification('success', 'Room Deleted', 'Room has been permanently deleted.');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  return {
    // State
    user,
    authLoading,
    accessDenied,
    room,
    members,
    bills,
    summary,
    loading,
    
    // Actions
    addMember,
    addBill,
    markPaid,
    deleteMember,
    deleteBill,
    deleteRoom,
    reload: load
  };
};
