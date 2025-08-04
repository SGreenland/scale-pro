/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - Added the required column `stripeSubId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "stripeId",
ADD COLUMN     "stripeSubId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "trialExpiresAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);
