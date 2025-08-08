import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: Promise<{ roomId: string }> };

export async function GET(_req: Request, ctx: Params) {
  const { roomId: roomIdStr } = await ctx.params;
  const roomId = Number(roomIdStr);
  const members = await prisma.member.findMany({ where: { roomId }, orderBy: { id: "asc" }});
  return NextResponse.json(members);
}


import { z } from "zod";
const MemberCreate = z.object({ name: z.string().min(1).max(80) });

export async function POST(req: Request, ctx: Params) {
  const { roomId: roomIdStr } = await ctx.params;
  const roomId = Number(roomIdStr);
  const json = await req.json().catch(() => null);
  const parsed = MemberCreate.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const member = await prisma.member.create({ data: { name: parsed.data.name.trim(), roomId }});
  return NextResponse.json(member, { status: 201 });
}

// Individual member deletion lives in /api/rooms/[roomId]/members/[memberId]