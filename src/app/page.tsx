"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/rooms").then(res => res.json()).then(setRooms);
  }, []);

  const addRoom = async () => {
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetch("/api/rooms").then(res => res.json()).then(setRooms);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>RoomSplit</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Room name" />
      <button onClick={addRoom}>Add Room</button>
      <ul>
        {rooms.map((r: unknown) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </main>
  );
}
