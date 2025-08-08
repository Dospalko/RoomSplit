import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const members = await prisma.member.findMany();
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const { name, roomId } = await req.json();
  if (!name || !roomId) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const member = await prisma.member.create({ data: { name, roomId } });
  return NextResponse.json(member);
}
