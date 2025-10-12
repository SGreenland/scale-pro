/*
  Warnings:

  - The primary key for the `NotePattern` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NotePattern` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserUnlockedPattern` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserUnlockedPattern` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `NotePattern` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `notePatternId` on the `UserUnlockedPattern` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."UserUnlockedPattern" DROP CONSTRAINT "UserUnlockedPattern_notePatternId_fkey";

-- AlterTable
ALTER TABLE "public"."NotePattern" DROP CONSTRAINT "NotePattern_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "NotePattern_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."UserUnlockedPattern" DROP CONSTRAINT "UserUnlockedPattern_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "notePatternId",
ADD COLUMN     "notePatternId" INTEGER NOT NULL,
ADD CONSTRAINT "UserUnlockedPattern_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "NotePattern_name_key" ON "public"."NotePattern"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserUnlockedPattern_userId_notePatternId_key" ON "public"."UserUnlockedPattern"("userId", "notePatternId");

-- AddForeignKey
ALTER TABLE "public"."UserUnlockedPattern" ADD CONSTRAINT "UserUnlockedPattern_notePatternId_fkey" FOREIGN KEY ("notePatternId") REFERENCES "public"."NotePattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
