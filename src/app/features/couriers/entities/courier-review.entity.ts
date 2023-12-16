import { CourierReview } from '@prisma/client';
import { CourierEntity } from './courier.entity';
import { ShopEntity } from '../../shops/entities';
import { Type } from 'class-transformer';

export class CourierReviewEntity implements CourierReview {
  constructor(partial: Partial<CourierReviewEntity>) {
    Object.assign(this, partial);
  }

  courierId: number;
  shopId: number;
  text: string;
  rating: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => CourierEntity)
  courier?: CourierEntity;

  @Type(() => ShopEntity)
  shop?: ShopEntity;
}
