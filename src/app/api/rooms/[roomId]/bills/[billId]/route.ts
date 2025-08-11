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

// Helper function to verify bill ownership via room
async function verifyBillOwnership(billId: number, userId: number) {
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        room: {
          userId: userId
        }
      }
    });
    return !!bill;
  } catch (error) {
    console.error('Error verifying bill ownership:', error);
    return false;
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ roomId: string; billId: string }> }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { billId } = await ctx.params;
    const id = Number(billId);
    
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { error: "Invalid bill id" }, 
        { status: 400 }
      );
    }

    // Verify user owns the room that contains this bill
    const ownsBill = await verifyBillOwnership(id, user.id);
    if (!ownsBill) {
      return NextResponse.json(
        { error: 'Access denied - bill not found or not owned by user' },
        { status: 403 }
      );
    }

    await prisma.bill.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    );
  }
}
