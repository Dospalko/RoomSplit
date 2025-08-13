import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { nanoid } from "nanoid";

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

// POST /api/rooms/[roomId]/invite - Create room invite
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

    const body = await request.json().catch(() => ({}));
    const { expiresIn = 7, maxUses = null } = body; // expires in days

    // Generate unique invite code
    const inviteCode = nanoid(10);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresIn);

    // Create invite
    const invite = await prisma.roomInvite.create({
      data: {
        roomId,
        inviteCode,
        expiresAt,
        maxUses,
      }
    });

    // Get room details for response
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true }
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/join/${inviteCode}`;

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        code: invite.inviteCode,
        url: inviteUrl,
        expiresAt: invite.expiresAt,
        maxUses: invite.maxUses,
        roomName: room?.name
      }
    });

  } catch (error) {
    console.error('Error creating room invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}

// GET /api/rooms/[roomId]/invite - List active invites for room
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

    const invites = await prisma.roomInvite.findMany({
      where: {
        roomId,
        isActive: true,
        expiresAt: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(invites);

  } catch (error) {
    console.error('Error fetching room invites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}
