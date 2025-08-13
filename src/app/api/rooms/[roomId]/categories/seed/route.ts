import { NextRequest, NextResponse } from "next/server";
import { createDefaultCategories } from "@/lib/defaultCategories";
import { getAuthenticatedUser, verifyRoomAccess } from "@/server/auth";

type Params = { params: Promise<{ roomId: string }> };

// POST /api/rooms/[roomId]/categories/seed - Create default categories for a room
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

    // Verify user has access to this room
    const hasAccess = await verifyRoomAccess(roomId, user.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied - room not found or not accessible' },
        { status: 403 }
      );
    }

    // Create default categories for this room
    await createDefaultCategories(roomId);

    return NextResponse.json({ success: true, message: 'Default categories created' });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
}
