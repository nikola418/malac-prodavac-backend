-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "availableAt" TEXT,
ADD COLUMN     "availableAtLatitude" DECIMAL(65,30),
ADD COLUMN     "availableAtLongitude" DECIMAL(65,30);
