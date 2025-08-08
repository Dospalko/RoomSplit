/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: { roomId: string } };

export async function GET(req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || new Date().toISOString().slice(0,7);

  const bills = await prisma.bill.findMany({
    where: { roomId, period },
    include: { shares: { include: { member: true } } },
  });

  const totalCents = bills.reduce((acc: any, b: { amountCents: any; }) => acc + b.amountCents, 0);
  const perMember: Record<number, { name: string; cents: number }> = {};
  for (const b of bills) {
    for (const s of b.shares) {
      const entry = perMember[s.memberId] ||= { name: s.member?.name ?? `Member ${s.memberId}`, cents: 0 };
      entry.cents += s.amountCents;
    }
  }
  return NextResponse.json({ period, totalCents, perMember });
}
