/*
  Warnings:

  - You are about to drop the column `productId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_productId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "productId",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "order_products" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,
    "orderId" INTEGER NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_products_productId_orderId_key" ON "order_products"("productId", "orderId");

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
