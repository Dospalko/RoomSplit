import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

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

// Helper function to verify room ownership via member
async function verifyMemberOwnership(memberId: number, userId: number) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        room: {
          userId: userId
        }
      }
    });
    return !!member;
  } catch (error) {
    console.error('Error verifying member ownership:', error);
    return false;
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ roomId: string; memberId: string }> }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { memberId } = await ctx.params;
    const id = Number(memberId);
    
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: "Invalid member id" }, 
        { status: 400 }
      );
    }

    // Verify user owns the room that contains this member
    const ownsMember = await verifyMemberOwnership(id, user.id);
    if (!ownsMember) {
      return NextResponse.json(
        { error: 'Access denied - member not found or not owned by user' },
        { status: 403 }
      );
    }

    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
