/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: { roomId: string } };

export async function GET(_req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const bills = await prisma.bill.findMany({
    where: { roomId },
    orderBy: { id: "desc" },
    include: {
      shares: { include: { member: true } }, // ⬅ mená členov
    },
  });
  return NextResponse.json(bills);
}

import { z } from "zod";
const BillCreate = z.object({
  title: z.string().min(1).max(120),
  amount: z.number().positive(),
  period: z.string().regex(/^\d{4}-\d{2}$/),
});

export async function POST(req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const json = await req.json().catch(() => null);
  const parsed = BillCreate.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const members = await prisma.member.findMany({ where: { roomId }});
  if (members.length === 0) return NextResponse.json({ error: "no members in room" }, { status: 400 });

  const amountCents = Math.round(parsed.data.amount * 100);
  const base = Math.floor(amountCents / members.length);
  let remainder = amountCents - base * members.length;

  const bill = await prisma.$transaction(async (tx: { bill: { create: (arg0: { data: { roomId: number; title: string; amountCents: number; period: string; }; }) => any; }; share: { create: (arg0: { data: { billId: any; memberId: any; amountCents: number; }; }) => any; }; }) => {
    const b = await tx.bill.create({ data: { roomId, title: parsed.data.title.trim(), amountCents, period: parsed.data.period }});
    for (const m of members) {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;
      await tx.share.create({ data: { billId: b.id, memberId: m.id, amountCents: base + extra }});
    }
    return b;
  });

  const out = await prisma.bill.findUnique({
    where: { id: bill.id },
    include: { shares: true },
  });

  return NextResponse.json(out, { status: 201 });
}
