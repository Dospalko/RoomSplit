import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: { roomId: string } };

export async function GET(_req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const members = await prisma.member.findMany({ where: { roomId }, orderBy: { id: "asc" }});
  return NextResponse.json(members);
}

export async function POST(req: Request, { params }: Params) {
  const roomId = Number(params.roomId);
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
  const member = await prisma.member.create({ data: { name: name.trim(), roomId }});
  return NextResponse.json(member, { status: 201 });
}
