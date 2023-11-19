/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `scheduled_pickups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `scheduled_pickups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduled_pickups" ADD COLUMN     "orderId" INTEGER NOT NULL,
ALTER COLUMN "timeOfDay" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "scheduled_pickups_orderId_key" ON "scheduled_pickups"("orderId");

-- AddForeignKey
ALTER TABLE "scheduled_pickups" ADD CONSTRAINT "scheduled_pickups_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
