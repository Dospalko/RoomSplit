/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

type Params = { params: Promise<{ roomId: string }> };

// Helper function to get authenticated user from session
async function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('user-session');
  
  if (!sessionCookie?.value) {
    return null;
  }

  const userId = parseInt(sessionCookie.value);
  if (isNaN(userId) || userId <= 0) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Helper function to verify room ownership
async function verifyRoomOwnership(roomId: number, userId: number) {
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: userId
      }
    });
    return !!room;
  } catch (error) {
    console.error('Error verifying room ownership:', error);
    return false;
  }
}

export async function GET(request: NextRequest, ctx: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId: roomIdStr } = await ctx.params;
    const roomId = Number(roomIdStr);

    if (!Number.isFinite(roomId)) {
      return NextResponse.json(
        { error: 'Invalid room ID' },
        { status: 400 }
      );
    }

    // Verify user owns this room
    const ownsRoom = await verifyRoomOwnership(roomId, user.id);
    if (!ownsRoom) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not owned by user' },
        { status: 403 }
      );
    }

    const bills = await prisma.bill.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      include: {
        shares: { include: { member: true } },
      },
    });
    
    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

// Incoming payload for creating a bill. "rule" & "meta" are optional; default rule = EQUAL.
const BillCreate = z.object({
  title: z.string().min(1).max(120),
  amount: z.number().positive(),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  rule: z.enum(["EQUAL", "PERCENT", "WEIGHT"]).optional(),
  meta: z.any().optional(),
});

export async function POST(req: Request, ctx: Params) {
  const { roomId: roomIdStr } = await ctx.params;
  const roomId = Number(roomIdStr);
  const json = await req.json().catch(() => null);
  const parsed = BillCreate.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { title, amount, period } = parsed.data;
  const rule = parsed.data.rule ?? "EQUAL";
  const meta = parsed.data.meta ?? null;

  const members = await prisma.member.findMany({ where: { roomId } });
  if (members.length === 0) return NextResponse.json({ error: "no members in room" }, { status: 400 });

  const amountCents = Math.round(amount * 100);
  if (amountCents <= 0) return NextResponse.json({ error: "amount must be > 0" }, { status: 400 });

  // Helper for proportional allocation with deterministic rounding.
  function allocateByValues(total: number, entries: { memberId: number; value: number }[]): { memberId: number; cents: number }[] {
    const positive = entries.filter(e => e.value > 0);
    if (positive.length === 0) return [];
    const sum = positive.reduce((a, b) => a + b.value, 0);
    if (sum === 0) return [];
    const withFrac = positive.map(e => {
      const raw = (total * e.value) / sum;
      const base = Math.floor(raw);
      const frac = raw - base;
      return { memberId: e.memberId, base, frac };
    });
    let remainder = total - withFrac.reduce((a, b) => a + b.base, 0);
    // Distribute remaining cents to largest fractional parts.
    withFrac.sort((a, b) => b.frac - a.frac);
    for (let i = 0; i < withFrac.length && remainder > 0; i++) {
      withFrac[i].base += 1;
      remainder -= 1;
    }
    // If due to some numeric oddity remainder negative (shouldn't), fix by removing from tail.
    for (let i = withFrac.length - 1; i >= 0 && remainder < 0; i--) {
      if (withFrac[i].base > 0) {
        withFrac[i].base -= 1;
        remainder += 1;
      }
    }
    return withFrac.map(e => ({ memberId: e.memberId, cents: e.base }));
  }

  let allocations: { memberId: number; cents: number }[] = [];
  let storeMeta: any = null;

  if (rule === "EQUAL") {
    const base = Math.floor(amountCents / members.length);
    let remainder = amountCents - base * members.length;
  allocations = members.map((m: { id: number }) => {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;
      return { memberId: m.id, cents: base + extra };
    });
  } else if (rule === "PERCENT") {
    const percents = meta?.percents && typeof meta.percents === 'object' ? meta.percents : null;
    if (!percents) return NextResponse.json({ error: "percents meta required" }, { status: 400 });
    const entries: { memberId: number; value: number }[] = [];
    let sum = 0;
    for (const m of members) {
      const vRaw = percents[String(m.id)];
      const v = typeof vRaw === 'number' ? vRaw : 0;
      if (v < 0) return NextResponse.json({ error: "percent must be >= 0" }, { status: 400 });
      entries.push({ memberId: m.id, value: v });
      sum += v;
    }
    if (sum <= 0) return NextResponse.json({ error: "sum of percents must be > 0" }, { status: 400 });
    // Optional: enforce near 100 (tolerance 0.01).
    if (Math.abs(sum - 100) > 0.01) return NextResponse.json({ error: "percents must sum to 100" }, { status: 400 });
    allocations = allocateByValues(amountCents, entries);
    storeMeta = { percents };
  } else if (rule === "WEIGHT") {
    const weights = meta?.weights && typeof meta.weights === 'object' ? meta.weights : null;
    if (!weights) return NextResponse.json({ error: "weights meta required" }, { status: 400 });
    const entries: { memberId: number; value: number }[] = [];
    let sum = 0;
    for (const m of members) {
      const vRaw = weights[String(m.id)];
      const v = typeof vRaw === 'number' ? vRaw : 0;
      if (v < 0) return NextResponse.json({ error: "weight must be >= 0" }, { status: 400 });
      entries.push({ memberId: m.id, value: v });
      sum += v;
    }
    if (sum <= 0) return NextResponse.json({ error: "sum of weights must be > 0" }, { status: 400 });
    allocations = allocateByValues(amountCents, entries);
    storeMeta = { weights };
  } else {
    return NextResponse.json({ error: "Unknown rule" }, { status: 400 });
  }

  // Safety: ensure sum matches total (adjust last if needed)
  const allocSum = allocations.reduce((a, b) => a + b.cents, 0);
  if (allocSum !== amountCents && allocations.length > 0) {
    const diff = amountCents - allocSum;
    allocations[0].cents += diff; // adjust first deterministically
  }

    const bill = await prisma.$transaction(async (tx) => {
      const b = await tx.bill.create({
        data: {
          roomId,
          title: title.trim(),
          amountCents,
          period,
          rule: rule as any,
          meta: storeMeta,
        },
      });
      for (const a of allocations) {
        await tx.share.create({ data: { billId: b.id, memberId: a.memberId, amountCents: a.cents } });
      }
      return b;
    });  const out = await prisma.bill.findUnique({
    where: { id: bill.id },
    include: { shares: { include: { member: true } } },
  });

  return NextResponse.json(out, { status: 201 });
}
