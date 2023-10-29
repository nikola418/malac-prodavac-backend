import { ReviewReply } from '@prisma/client';

export class ProductReviewReplyEntity implements ReviewReply {
  constructor(partial: Partial<ProductReviewReplyEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  text: string;
  reviewId: number;
  shopId: number;
  updatedAt: Date;
  createdAt: Date;
}
