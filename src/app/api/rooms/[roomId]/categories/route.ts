import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import { getAuthenticatedUser, verifyRoomAccess, verifyRoomOwnership } from "@/server/auth";

type Params = { params: Promise<{ roomId: string }> };

// GET /api/rooms/[roomId]/categories - Get all categories for a room
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

    const categories = await prisma.category.findMany({
      where: { roomId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { bills: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

const CategoryCreate = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().max(10).optional()
});

// POST /api/rooms/[roomId]/categories - Create a new category
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

    // Verify user owns this room (only owners can create categories)
    const ownsRoom = await verifyRoomOwnership(roomId, user.id);
    if (!ownsRoom) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not owned by user' },
        { status: 403 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = CategoryCreate.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, description, color, icon } = parsed.data;

    // Check if category with this name already exists in this room
    const existingCategory = await prisma.category.findUnique({
      where: {
        name_roomId: {
          name: name.trim(),
          roomId
        }
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        color: color || '#3B82F6',
        icon: icon?.trim(),
        roomId
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
