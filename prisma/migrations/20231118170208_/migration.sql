-- DropForeignKey
ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
