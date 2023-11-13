import { FavoriteProduct } from '@prisma/client';
import { ProductEntity } from '../../products/entities';
import { Type } from 'class-transformer';

export class FavoriteProductEntity implements FavoriteProduct {
  constructor(partial: Partial<FavoriteProductEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  productId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductEntity)
  product?: ProductEntity;
}
