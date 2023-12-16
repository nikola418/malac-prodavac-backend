import { CustomerReview } from '@prisma/client';
import { CustomerEntity } from './customer.entity';
import { ShopEntity } from '../../shops/entities';
import { Type } from 'class-transformer';

export class CustomerReviewEntity implements CustomerReview {
  constructor(partial: Partial<CustomerReviewEntity>) {
    Object.assign(this, partial);
  }

  customerId: number;
  shopId: number;
  text: string;
  rating: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => CustomerEntity)
  customer?: CustomerEntity;

  @Type(() => ShopEntity)
  shop?: ShopEntity;
}
