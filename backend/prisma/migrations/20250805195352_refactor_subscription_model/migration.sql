/*
  Warnings:

  - You are about to drop the column `active` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'incomplete', 'past_due', 'unpaid');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "active",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL;
