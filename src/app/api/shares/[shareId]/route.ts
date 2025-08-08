import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function PATCH(req: Request, ctx: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await ctx.params;
  const { paid } = await req.json();
  const updated = await prisma.share.update({
    where: { id: Number(shareId) },
    data: { paid: Boolean(paid) },
  });
  return NextResponse.json(updated);
}
