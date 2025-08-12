import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

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

    // Get room details, ensuring user owns it
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: user.id
      },
      select: {
        id: true,
        name: true
      }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
