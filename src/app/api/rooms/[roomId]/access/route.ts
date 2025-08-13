import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { getAuthenticatedUser, verifyRoomAccess } from "@/server/auth";

type Params = { params: Promise<{ roomId: string }> };

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

    // Verify user has access to this room
    const hasAccess = await verifyRoomAccess(roomId, user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not accessible' },
        { status: 403 }
      );
    }

    // Get room with owner and members
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        roomMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Format the response
    const accessMembers = [
      // Owner first
      {
        id: room.user.id,
        name: room.user.name,
        email: room.user.email,
        role: 'owner',
        joinedAt: null // Owner doesn't have a joinedAt date
      },
      // Then members
      ...room.roomMembers.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: 'member',
        joinedAt: member.joinedAt
      }))
    ];

    return NextResponse.json({
      roomName: room.name,
      accessMembers
    });

  } catch (error) {
    console.error('Error fetching room access members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room access members' },
      { status: 500 }
    );
  }
}
