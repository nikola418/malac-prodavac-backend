/*
  Warnings:

  - You are about to drop the column `openFromHours` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `openTillHours` on the `shops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shops" DROP COLUMN "openFromHours",
DROP COLUMN "openTillHours",
ADD COLUMN     "openFrom" TEXT,
ADD COLUMN     "openTill" TEXT;
