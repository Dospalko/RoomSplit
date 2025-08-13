import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import { createDefaultCategories } from "@/lib/defaultCategories";

// Helper function to get authenticated user from session
async function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('user-session');
  
  if (!sessionCookie?.value) {
    return null;
  }

  // Validate session cookie format and parse safely
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

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get rooms the user owns
    const ownedRooms = await prisma.room.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        userId: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Get rooms the user is a member of (invited to)
    const memberRooms = await prisma.room.findMany({
      where: {
        roomMembers: {
          some: {
            userId: user.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Format the response to include room type
    const response = {
      ownedRooms: ownedRooms.map(room => ({
        id: room.id,
        name: room.name,
        type: 'owned'
      })),
      memberRooms: memberRooms.map(room => ({
        id: room.id,
        name: room.name,
        type: 'member',
        ownerName: room.user.name
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

const RoomCreate = z.object({ name: z.string().min(1).max(80) });

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = RoomCreate.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // Create room with the authenticated user as owner
    const room = await prisma.room.create({ 
      data: { 
        name: parsed.data.name.trim(),
        userId: user.id
      } 
    });

    // Create default categories for the new room
    await createDefaultCategories(room.id);

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const id = idParam ? Number(idParam) : NaN;
    
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // Only allow deletion if the room belongs to the authenticated user
    const room = await prisma.room.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}