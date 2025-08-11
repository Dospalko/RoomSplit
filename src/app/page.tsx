"use client";

import { useEffect, useState } from "react";
import { 
  Hero, 
  StatsSection, 
  FeaturesSection, 
  HowItWorksSection,
  RoomGrid,
  RoomCreateModal,
  SkeletonLoader
} from "@/components";

type Room = { id: number; name: string };

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder login state

  useEffect(() => {
    // Only fetch rooms if logged in
    if (isLoggedIn) {
      fetchRooms();
    }
  }, [isLoggedIn]);

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        // Quick response - no artificial delay
        setRooms(data);
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
        setShowModal(false);
        setCreating(false);
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setCreating(false);
    }
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room? This will delete all associated data.")) return;
    
    const res = await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchRooms();
    }
  };

  const openCreateModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogin = () => {
    // Placeholder login - just toggle state for now
    setIsLoggedIn(true);
  };

  return (
    <>
      {/* Remove PageLoader completely for instant loading */}
      <div 
        className="min-h-screen relative" 
      >
        <Hero onCreateRoom={openCreateModal} />
        <div id="stats">
          <StatsSection stats={{ count: rooms.length }} />
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
            {!isLoggedIn ? (
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
                    onClick={handleLogin}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In to Continue
                  </button>
                  
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account? 
                    <button className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                      Create one for free
                    </button>
                  </div>
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
              <RoomGrid 
                rooms={rooms}
                onDeleteRoom={deleteRoom}
                onCreateRoom={openCreateModal}
                creating={creating}
              />
            )}
          </div>
        </div>

        {/* Room Creation Modal */}
        {showModal && (
          <RoomCreateModal
            onCreateRoom={createRoom}
            onClose={closeModal}
            creating={creating}
          />
        )}
      </div>
    </>
  );
}
