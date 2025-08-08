import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const rooms = await prisma.room.findMany();
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const room = await prisma.room.create({ data: { name } });
  return NextResponse.json(room);
}
