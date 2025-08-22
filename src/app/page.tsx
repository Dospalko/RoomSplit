"use client";

import { useEffect, useState } from "react";
import { 
  Hero, 
  StatsSection, 
  FeaturesSection, 
  HowItWorksSection,
  RoomGrid,
  SkeletonLoader
} from "@/components";
import { RoomCreateModal, LoginModal } from "@/components/ui/modals";
import { useNotifications } from "@/components/features/rooms/hooks/useNotifications";
import { NotificationContainer } from "@/components/features/rooms/components/NotificationContainer";
import type { OwnedRoom, MemberRoom, User } from "@/types";

export default function Home() {
  const [ownedRooms, setOwnedRooms] = useState<OwnedRoom[]>([]);
  const [memberRooms, setMemberRooms] = useState<MemberRoom[]>([]);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Add notification system
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    // Check for existing session
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Only fetch rooms if logged in
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const checkAuthStatus = async () => {
    setAuthLoading(true);
    try {
      // Check if user has valid session
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        // Handle new API response format
        setOwnedRooms(data.ownedRooms || []);
        setMemberRooms(data.memberRooms || []);
        setRoomsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRoomsLoading(false);
    }
  };

  const createRoom = async (roomName: string) => {
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName.trim() }),
      });
      if (res.ok) {
        // Quick response without artificial delay
        await fetchRooms();
        setShowCreateModal(false);
        setCreating(false);
        
        // Show success notification
        addNotification(
          'success', 
          'Room Created Successfully!', 
          `"${roomName.trim()}" is ready for expense sharing.`
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to create room';
        setCreating(false);
        
        // Show error notification
        addNotification(
          'error', 
          'Room Creation Failed', 
          errorMessage
        );
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setCreating(false);
      
      // Show error notification
      addNotification(
        'error', 
        'Network Error', 
        'Unable to create room. Please check your connection and try again.'
      );
    }
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room? This will delete all associated data.")) return;
    
    try {
      const res = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchRooms();
        
        // Show success notification
        addNotification(
          'success', 
          'Room Deleted', 
          'The room and all its data have been permanently deleted.'
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to delete room';
        
        // Show error notification
        addNotification(
          'error', 
          'Delete Failed', 
          errorMessage
        );
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      
      // Show error notification
      addNotification(
        'error', 
        'Network Error', 
        'Unable to delete room. Please check your connection and try again.'
      );
    }
  };

  const openCreateModal = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
    
    // Show welcome notification
    addNotification(
      'success', 
      `Welcome back, ${userData.name}!`, 
      'You are now signed in and can manage your expense rooms.'
    );
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setOwnedRooms([]);
      setMemberRooms([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      {/* Remove PageLoader completely for instant loading */}
      <div 
        className="min-h-screen relative" 
      >
        <Hero onCreateRoom={openCreateModal} />
        <div id="stats">
          <StatsSection stats={{ count: ownedRooms.length + memberRooms.length }} />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        
        {/* Room Management Section */}
        <div id="rooms" className="relative py-20 lg:py-32">
          <div className="w-full mx-auto px-6 lg:px-8">
            {authLoading ? (
              <div className="text-center">
                <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
              </div>
            ) : !user ? (
              /* Login Placeholder */
              <div className="text-center max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-mono">
                    Access Your Rooms
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Sign in to view and manage your expense rooms. Keep track of shared costs with your team, friends, or family.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={openLoginModal}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In to Continue
                  </button>
                </div>

                {/* Feature Preview Cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: "👥", title: "Team Rooms", desc: "Collaborate with your team" },
                    { icon: "📊", title: "Smart Analytics", desc: "Track expenses in real-time" },
                    { icon: "💰", title: "Fair Splitting", desc: "Automatic cost distribution" }
                  ].map((feature, i) => (
                    <div key={i} className="p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                      <div className="text-2xl mb-3">{feature.icon}</div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : roomsLoading ? (
              <SkeletonLoader 
                type="room-grid" 
                count={6} 
                className="animate-pulse" 
              />
            ) : (
              <div>
                {/* User info and logout */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Welcome back, {user.name}!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Manage your expense rooms
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                
                <RoomGrid 
                  ownedRooms={ownedRooms}
                  memberRooms={memberRooms}
                  onDeleteRoom={deleteRoom}
                  onCreateRoom={openCreateModal}
                  creating={creating}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <RoomCreateModal
            onCreateRoom={createRoom}
            onClose={closeCreateModal}
            creating={creating}
          />
        )}

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </>
  );
}
