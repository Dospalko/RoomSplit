import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const rooms = await prisma.room.findMany();
  return NextResponse.json(rooms);
}

import { z } from "zod";
const RoomCreate = z.object({ name: z.string().min(1).max(80) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = RoomCreate.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

  const room = await prisma.room.create({ data: { name: parsed.data.name.trim() } });
  return NextResponse.json(room, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}