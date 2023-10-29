import { Review } from '@prisma/client';

export class ProductReviewEntity implements Review {
  constructor(partial: Partial<ProductReviewEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  productId: number;
  text: string;
  rating: number;
  updatedAt: Date;
  createdAt: Date;
}
