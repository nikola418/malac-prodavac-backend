import { FavoriteShop } from '@prisma/client';
import { ShopEntity } from '../../shops/entities';
import { Type } from 'class-transformer';

export class FavoriteShopEntity implements FavoriteShop {
  constructor(partial: Partial<FavoriteShopEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  shopId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ShopEntity)
  shop?: ShopEntity;
}
