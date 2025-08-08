import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function PATCH(req: Request, { params }: { params: { shareId: string } }) {
  const { paid } = await req.json();
  const updated = await prisma.share.update({
    where: { id: Number(params.shareId) },
    data: { paid: Boolean(paid) },
  });
  return NextResponse.json(updated);
}
