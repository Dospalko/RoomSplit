import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function DELETE(_req: Request, { params }: { params: { roomId: string; memberId: string } }) {
  const id = Number(params.memberId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
  await prisma.member.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
