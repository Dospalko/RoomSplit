import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

type Params = { params: Promise<{ roomId: string }> };

// Helper function to get authenticated user from session
async function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('user-session');
  
  if (!sessionCookie?.value) {
    return null;
  }

  const userId = parseInt(sessionCookie.value);
  if (isNaN(userId) || userId <= 0) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Helper function to verify room ownership
async function verifyRoomOwnership(roomId: number, userId: number) {
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: userId
      }
    });
    return !!room;
  } catch (error) {
    console.error('Error verifying room ownership:', error);
    return false;
  }
}

export async function GET(request: NextRequest, ctx: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId: roomIdStr } = await ctx.params;
    const roomId = Number(roomIdStr);

    if (!Number.isFinite(roomId)) {
      return NextResponse.json(
        { error: 'Invalid room ID' },
        { status: 400 }
      );
    }

    // Verify user owns this room
    const ownsRoom = await verifyRoomOwnership(roomId, user.id);
    if (!ownsRoom) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not owned by user' },
        { status: 403 }
      );
    }

    const members = await prisma.member.findMany({ 
      where: { roomId }, 
      orderBy: { id: "asc" }
    });
    
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

const MemberCreate = z.object({ name: z.string().min(1).max(80) });

export async function POST(request: NextRequest, ctx: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId: roomIdStr } = await ctx.params;
    const roomId = Number(roomIdStr);

    if (!Number.isFinite(roomId)) {
      return NextResponse.json(
        { error: 'Invalid room ID' },
        { status: 400 }
      );
    }

    // Verify user owns this room
    const ownsRoom = await verifyRoomOwnership(roomId, user.id);
    if (!ownsRoom) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not owned by user' },
        { status: 403 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = MemberCreate.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid member name" }, { status: 400 });
    }

    const member = await prisma.member.create({ 
      data: { 
        name: parsed.data.name.trim(), 
        roomId 
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}