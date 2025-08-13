import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/server/db';
import { getAuthenticatedUser, verifyRoomAccess } from "@/server/auth";

// /api/rooms/[roomId]/summary?period=YYYY-MM
// Response: { period, totalCents, perMember: { [memberId]: { name, cents } } }

const PERIOD_RE = /^\d{4}-\d{2}$/;

export async function GET(req: NextRequest, ctx: { params: Promise<{ roomId: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId: roomIdStr } = await ctx.params;
    const roomId = Number(roomIdStr);
    if (!Number.isFinite(roomId)) return NextResponse.json({ error: 'invalid room id' }, { status: 400 });

    // Verify user has access to this room
    const hasAccess = await verifyRoomAccess(roomId, user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not accessible' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '';
    if (!PERIOD_RE.test(period)) return NextResponse.json({ error: 'invalid period' }, { status: 400 });

  // Fetch members for name mapping
  const members = await prisma.member.findMany({ where: { roomId }, orderBy: { id: 'asc' } });
  const nameById = Object.fromEntries(members.map((m: { id: number; name: string }) => [m.id, m.name]));

  // Fetch bills for this period with shares
  const bills = await prisma.bill.findMany({
    where: { roomId, period },
    include: { shares: true },
  });

  let totalCents = 0;
  const perMember: Record<string, { name: string; cents: number }> = {};
  for (const m of members) perMember[String(m.id)] = { name: m.name, cents: 0 };

  for (const b of bills) {
    totalCents += b.amountCents;
    for (const s of b.shares) {
      const key = String(s.memberId);
      const entry = perMember[key] || { name: nameById[s.memberId] || `Member ${s.memberId}`, cents: 0 };
      entry.cents += s.amountCents;
      perMember[key] = entry;
    }
  }

  return NextResponse.json({ period, totalCents, perMember });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
