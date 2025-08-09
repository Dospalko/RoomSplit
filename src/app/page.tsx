"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import RoomGrid from "@/components/RoomGrid";
import RoomCreateModal from "@/components/RoomCreateModal";

type Room = { id: number; name: string };

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch("/api/rooms");
    if (res.ok) {
      const data = await res.json();
      setRooms(data);
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
        await fetchRooms();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
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
          <RoomGrid 
            rooms={rooms}
            onDeleteRoom={deleteRoom}
            onCreateRoom={openCreateModal}
            creating={creating}
          />
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
  );
}
