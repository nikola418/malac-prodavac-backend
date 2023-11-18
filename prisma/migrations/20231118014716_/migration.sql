-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notificationPayloadId_fkey" FOREIGN KEY ("notificationPayloadId") REFERENCES "NotificationPayload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
