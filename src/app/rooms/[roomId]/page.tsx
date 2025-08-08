"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";

type Member = { id: number; name: string };
type Share = { id: number; memberId: number; amountCents: number; paid: boolean; member?: { id: number; name: string } };
type Bill = { id: number; title: string; amountCents: number; period: string; shares: Share[] };

const fmt = (cents: number) => (cents / 100).toFixed(2) + " €";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const rid = Number(roomId);

  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [memberName, setMemberName] = useState("");
  const [title, setTitle] = useState("Electricity");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState("80");

  // Map for quick id -> name lookup (memoized)
  const memberNameById = useMemo(() => {
    const map: Record<number, string> = {};
    for (const m of members) map[m.id] = m.name;
    return map;
  }, [members]);

  // Replace previous load with memoized version
  const load = useCallback(async () => {
    if (!Number.isFinite(rid)) return;
    const [m, b] = await Promise.all([
      fetch(`/api/rooms/${rid}/members`).then((r) => r.json()),
      fetch(`/api/rooms/${rid}/bills`).then((r) => r.json()),
    ]);
    setMembers(m);
    setBills(b);
  }, [rid]);

  // Update useEffect to depend on load
  useEffect(() => {
    load();
  }, [load]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    await fetch(`/api/rooms/${rid}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: memberName.trim() }),
    });
    setMemberName("");
    load();
  };

  const addBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(amount);
    if (!title.trim() || !amountNum || !period.match(/^\d{4}-\d{2}$/)) return;
    await fetch(`/api/rooms/${rid}/bills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), amount: amountNum, period }),
    });
    load();
  };

  const markPaid = async (shareId: number, paid: boolean) => {
    await fetch(`/api/shares/${shareId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg border-neutral-200 dark:border-neutral-800">
        <div className="px-5 pt-4 pb-2 font-semibold">Members</div>
        <div className="px-5 pb-4">
          <form onSubmit={addMember} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Alice"
              />
            </div>
            <button className="rounded-md px-4 py-2 text-sm bg-black text-white" type="submit">
              Add
            </button>
          </form>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2">
            {members.map((m) => (
              <li key={m.id} className="text-sm border rounded px-3 py-2 border-neutral-200 dark:border-neutral-800">
                #{m.id} {m.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border rounded-lg border-neutral-200 dark:border-neutral-800">
        <div className="px-5 pt-4 pb-2 font-semibold">New bill (equal split)</div>
        <div className="px-5 pb-4">
          <form onSubmit={addBill} className="grid sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Title</label>
              <input
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Electricity"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Period (YYYY-MM)</label>
              <input
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2025-08"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Amount (€)</label>
              <input
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="80"
              />
            </div>
            <div className="sm:col-span-4">
              <button className="rounded-md px-4 py-2 text-sm bg-black text-white" type="submit">
                Create & split
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Bills</h3>
        {bills.length === 0 ? (
          <div className="text-sm text-neutral-500 border rounded px-4 py-3 border-neutral-200 dark:border-neutral-800">
            No bills yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {bills.map((b) => (
              <li key={b.id} className="border rounded-lg p-4 border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-neutral-500">
                    {b.period} • {fmt(b.amountCents)}
                  </div>
                </div>
                <ul className="mt-2 grid sm:grid-cols-2 gap-2">
                  {b.shares.map((s) => {
                    const displayName = s.member?.name || memberNameById[s.memberId] || `Member ${s.memberId}`;
                    return (
                      <li
                        key={s.id}
                        className="text-sm flex items-center justify-between border rounded px-3 py-2 border-neutral-200 dark:border-neutral-800"
                      >
                        <span>
                          {displayName}: {fmt(s.amountCents)}
                        </span>
                        {s.paid ? (
                          <span className="text-green-600">PAID</span>
                        ) : (
                          <button
                            onClick={() => markPaid(s.id, true)}
                            className="rounded px-3 py-1 border text-xs border-neutral-300 dark:border-neutral-700"
                          >
                            mark paid
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
