import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

type Params = { params: Promise<{ inviteCode: string }> };

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

// POST /api/join/[inviteCode] - Join room via invite code
export async function POST(request: NextRequest, ctx: Params) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { inviteCode } = await ctx.params;

    // Find the invite
    const invite = await prisma.roomInvite.findUnique({
      where: { inviteCode },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            userId: true // room owner
          }
        }
      }
    });

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    // Check if invite is still valid
    if (!invite.isActive) {
      return NextResponse.json(
        { error: 'This invite has been deactivated' },
        { status: 400 }
      );
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This invite has expired' },
        { status: 400 }
      );
    }

    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      return NextResponse.json(
        { error: 'This invite has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check if user is already the owner
    if (invite.room.userId === user.id) {
      return NextResponse.json(
        { error: 'You are already the owner of this room' },
        { status: 400 }
      );
    }

    // Check if user is already a member (if we implement room members table later)
    // For now, we'll allow multiple joins and handle it gracefully

    // Update invite usage count
    await prisma.roomInvite.update({
      where: { id: invite.id },
      data: { usedCount: invite.usedCount + 1 }
    });

    // For now, we'll just return success since we don't have room members table yet
    // Later we'll add the user to the room members
    
    return NextResponse.json({
      success: true,
      room: {
        id: invite.room.id,
        name: invite.room.name
      },
      message: `Successfully joined "${invite.room.name}"!`
    });

  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
}

// GET /api/join/[inviteCode] - Get invite details (for preview)
export async function GET(request: NextRequest, ctx: Params) {
  try {
    const { inviteCode } = await ctx.params;

    // Find the invite
    const invite = await prisma.roomInvite.findUnique({
      where: { inviteCode },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!invite) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    // Check if invite is still valid
    const isExpired = invite.expiresAt < new Date();
    const isMaxedOut = invite.maxUses && invite.usedCount >= invite.maxUses;
    const isValid = invite.isActive && !isExpired && !isMaxedOut;

    return NextResponse.json({
      valid: isValid,
      room: {
        name: invite.room.name,
        owner: invite.room.user.name
      },
      invite: {
        expiresAt: invite.expiresAt,
        usedCount: invite.usedCount,
        maxUses: invite.maxUses,
        isActive: invite.isActive
      },
      ...(isExpired && { error: 'This invite has expired' }),
      ...(isMaxedOut && { error: 'This invite has reached its usage limit' }),
      ...(!invite.isActive && { error: 'This invite has been deactivated' })
    });

  } catch (error) {
    console.error('Error fetching invite details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invite details' },
      { status: 500 }
    );
  }
}
