import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: { roomId: string } };

export async function GET(_req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const bills = await prisma.bill.findMany({
    where: { roomId },
    orderBy: { id: "desc" },
    include: { shares: true },
  });
  return NextResponse.json(bills);
}

export async function POST(req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const { title, amount, period } = await req.json() as { title: string; amount: number; period: string };

  if (!title?.trim() || !Number.isFinite(amount) || !period?.match(/^\d{4}-\d{2}$/)) {
    return NextResponse.json({ error: "title, amount, period(YYYY-MM) required" }, { status: 400 });
  }

  const members = await prisma.member.findMany({ where: { roomId }});
  if (members.length === 0) return NextResponse.json({ error: "no members in room" }, { status: 400 });

  const amountCents = Math.round(amount * 100);
  const base = Math.floor(amountCents / members.length);
  let remainder = amountCents - base * members.length;

  const bill = await prisma.$transaction(async (tx) => {
    const b = await tx.bill.create({ data: { roomId, title: title.trim(), amountCents, period }});
    for (const m of members) {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;
      await tx.share.create({ data: { billId: b.id, memberId: m.id, amountCents: base + extra }});
    }
    return b;
  });

  const out = await prisma.bill.findUnique({ where: { id: bill.id }, include: { shares: true }});
  return NextResponse.json(out, { status: 201 });
}
