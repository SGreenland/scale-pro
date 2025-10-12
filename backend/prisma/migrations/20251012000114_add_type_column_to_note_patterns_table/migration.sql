/*
  Warnings:

  - Added the required column `type` to the `NotePattern` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."NotePattern" ADD COLUMN     "type" TEXT NOT NULL;
