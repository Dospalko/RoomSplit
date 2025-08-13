import { NextRequest } from "next/server";
import { prisma } from "./db";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
}

// Helper function to get authenticated user from session
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
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

// Helper function to verify room access (owner OR member)
export async function verifyRoomAccess(roomId: number, userId: number): Promise<boolean> {
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        OR: [
          { userId: userId }, // User is the owner
          { 
            roomMembers: {
              some: {
                userId: userId
              }
            }
          } // User is a member
        ]
      }
    });
    return !!room;
  } catch (error) {
    console.error('Error verifying room access:', error);
    return false;
  }
}

// Helper function to verify room ownership (only owner)
export async function verifyRoomOwnership(roomId: number, userId: number): Promise<boolean> {
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        userId: userId
      }
    });
    return !!room;
  } catch (error) {
    console.error('Error verifying room ownership:', error);
    return false;
  }
}
