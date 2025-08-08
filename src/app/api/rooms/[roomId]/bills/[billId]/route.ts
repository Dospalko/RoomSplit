import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function DELETE(_req: Request, { params }: { params: { roomId: string; billId: string } }) {
  const id = Number(params.billId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid bill id" }, { status: 400 });
  await prisma.bill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
