-- CreateTable
CREATE TABLE "public"."NotePattern" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pattern" JSONB[],
    "isPremium" BOOLEAN NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotePattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserUnlockedPattern" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notePatternId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserUnlockedPattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserUnlockedPattern_userId_notePatternId_key" ON "public"."UserUnlockedPattern"("userId", "notePatternId");

-- AddForeignKey
ALTER TABLE "public"."UserUnlockedPattern" ADD CONSTRAINT "UserUnlockedPattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserUnlockedPattern" ADD CONSTRAINT "UserUnlockedPattern_notePatternId_fkey" FOREIGN KEY ("notePatternId") REFERENCES "public"."NotePattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
