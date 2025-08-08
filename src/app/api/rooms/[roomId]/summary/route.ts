import { NextResponse } from "next/server";
import { prisma } from '@/server/db';

// /api/rooms/[roomId]/summary?period=YYYY-MM
// Response: { period, totalCents, perMember: { [memberId]: { name, cents } } }

const PERIOD_RE = /^\d{4}-\d{2}$/;

export async function GET(req: Request, ctx: { params: Promise<{ roomId: string }> }) {
  const { roomId: roomIdStr } = await ctx.params;
  const roomId = Number(roomIdStr);
  if (!Number.isFinite(roomId)) return NextResponse.json({ error: 'invalid room id' }, { status: 400 });

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
}
