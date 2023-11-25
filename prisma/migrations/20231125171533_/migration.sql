/*
  Warnings:

  - You are about to drop the column `day` on the `scheduled_pickups` table. All the data in the column will be lost.
  - Added the required column `date` to the `scheduled_pickups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduled_pickups" DROP COLUMN "day",
ADD COLUMN     "date" TEXT NOT NULL;
