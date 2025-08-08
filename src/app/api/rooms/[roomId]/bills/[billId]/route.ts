import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function DELETE(_req: Request, ctx: { params: Promise<{ roomId: string; billId: string }> }) {
  const { billId } = await ctx.params;
  const id = Number(billId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid bill id" }, { status: 400 });
  await prisma.bill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
