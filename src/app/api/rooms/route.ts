import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

// Helper function to get authenticated user from session
async function getAuthenticatedUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('user-session');
  
  if (!sessionCookie?.value) {
    return null;
  }

  const userId = parseInt(sessionCookie.value);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true }
  });

  return user;
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

    // Only return rooms belonging to the authenticated user
    const rooms = await prisma.room.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        id: 'desc' // Show newest rooms first
      }
    });

    return NextResponse.json(rooms);
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