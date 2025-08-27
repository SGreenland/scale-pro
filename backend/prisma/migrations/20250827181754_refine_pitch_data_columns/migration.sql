/*
  Warnings:

  - You are about to drop the column `accuracy` on the `PitchData` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PitchData` table. All the data in the column will be lost.
  - Added the required column `averageDeviation` to the `PitchData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentageInTune` to the `PitchData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toleranceLevel` to the `PitchData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PitchData" DROP COLUMN "accuracy",
DROP COLUMN "notes",
ADD COLUMN     "averageDeviation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "percentageInTune" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "toleranceLevel" TEXT NOT NULL;
