import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function DELETE(_req: Request, ctx: { params: Promise<{ roomId: string; memberId: string }> }) {
  const { memberId } = await ctx.params;
  const id = Number(memberId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
