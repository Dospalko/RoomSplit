import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import { getAuthenticatedUser, verifyRoomAccess } from "@/server/auth";

type Params = { params: Promise<{ roomId: string }> };

// GET /api/rooms/[roomId]/tags - Get all tags for a room
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

    const tags = await prisma.tag.findMany({
      where: { roomId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { billTags: true }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

const TagCreate = z.object({
  name: z.string().min(1).max(30),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional()
});

// POST /api/rooms/[roomId]/tags - Create a new tag
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

    // Verify user has access to this room (members can create tags)
    const hasAccess = await verifyRoomAccess(roomId, user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not accessible' },
        { status: 403 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = TagCreate.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid tag data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, color } = parsed.data;

    // Check if tag with this name already exists in this room
    const existingTag = await prisma.tag.findUnique({
      where: {
        name_roomId: {
          name: name.trim(),
          roomId
        }
      }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        color: color || '#6B7280',
        roomId
      }
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[roomId]/tags - Delete a tag
export async function DELETE(request: NextRequest, ctx: Params) {
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

    const { searchParams } = new URL(request.url);
    const tagIdParam = searchParams.get("tagId");
    const tagId = tagIdParam ? Number(tagIdParam) : NaN;
    
    if (!Number.isFinite(tagId)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Verify tag belongs to this room
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        roomId
      }
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    // Delete the tag (this will cascade delete billTags due to foreign key constraints)
    await prisma.tag.delete({ 
      where: { id: tagId } 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
