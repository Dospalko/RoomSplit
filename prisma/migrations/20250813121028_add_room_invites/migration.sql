-- CreateTable
CREATE TABLE "RoomInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" INTEGER NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoomInvite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomInvite_inviteCode_key" ON "RoomInvite"("inviteCode");
