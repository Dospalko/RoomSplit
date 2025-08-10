"use client";

import { useEffect, useState } from "react";
import { 
  Hero, 
  StatsSection, 
  FeaturesSection, 
  HowItWorksSection,
  RoomGrid,
  RoomCreateModal,
  SkeletonLoader,
  PageLoader,
  ButtonLoader
} from "@/components";

type Room = { id: number; name: string };

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fetchRooms();
    }, 2000);
  }, []);

  const fetchRooms = async () => {
    setRoomsLoading(true);
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        // Simulate network delay for demo
        setTimeout(() => {
          setRooms(data);
          setRoomsLoading(false);
        }, 1000);
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
        // Add delay to show loading animation
        setTimeout(async () => {
          await fetchRooms();
          setShowModal(false);
          setCreating(false);
        }, 1500);
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

  return (
    <>
      {/* Page Loader */}
      <PageLoader 
        isLoading={loading} 
        progress={loading ? 75 : 100}
        message="Initializing RoomSplit experience"
      />
      
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
            {roomsLoading ? (
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
