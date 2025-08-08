"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Room = { id: number; name: string };

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");

  const load = () =>
    fetch("/api/rooms")
      .then((r) => r.json())
      .then(setRooms);

  useEffect(() => {
    load();
  }, []);

  const addRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      load();
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white/70 dark:bg-neutral-900/40">
        <div className="px-5 pt-4 pb-2 font-semibold">Create a room</div>
        <div className="px-5 pb-5">
          <form onSubmit={addRoom} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Room name
              </label>
              <input
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. C211"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-sm text-neutral-500 mt-1">Create a room for your flat/roommates.</p>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 active:opacity-80"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your rooms</h2>
        {rooms.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-5 py-4 text-sm text-neutral-500">
            No rooms yet. Create your first one above.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {rooms.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-neutral-500">ID: {r.id}</div>
                </div>
                <Link
                  href={`/rooms/${r.id}`}
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
