/*
  Warnings:

  - You are about to drop the column `currentLocation` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocationLatitude` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `currentLocationLongitude` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerKilometer` on the `couriers` table. All the data in the column will be lost.
  - You are about to drop the column `timeOfSelfPickup` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Workday" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterTable
ALTER TABLE "couriers" DROP COLUMN "currentLocation",
DROP COLUMN "currentLocationLatitude",
DROP COLUMN "currentLocationLongitude",
DROP COLUMN "pricePerKilometer",
ADD COLUMN     "routeEndLatitude" DECIMAL(65,30),
ADD COLUMN     "routeEndLongitude" DECIMAL(65,30),
ADD COLUMN     "routeStartLatitude" DECIMAL(65,30),
ADD COLUMN     "routeStartLongitude" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "timeOfSelfPickup";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "title" DROP DEFAULT;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "openFromDays" "Workday",
ADD COLUMN     "openFromHours" DECIMAL(65,30),
ADD COLUMN     "openTillDays" "Workday",
ADD COLUMN     "openTillHours" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "scheduled_pickups" (
    "id" SERIAL NOT NULL,
    "timeOfDay" DECIMAL(65,30) NOT NULL,
    "day" "Workday" NOT NULL,
    "accepted" BOOLEAN,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduled_pickups_pkey" PRIMARY KEY ("id")
);
