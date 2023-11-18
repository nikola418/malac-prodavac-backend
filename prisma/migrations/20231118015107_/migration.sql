/*
  Warnings:

  - You are about to drop the `NotificationPayload` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notificationPayloadId_fkey";

-- DropTable
DROP TABLE "NotificationPayload";

-- CreateTable
CREATE TABLE "notification_payloads" (
    "id" SERIAL NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_payloads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notificationPayloadId_fkey" FOREIGN KEY ("notificationPayloadId") REFERENCES "notification_payloads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
