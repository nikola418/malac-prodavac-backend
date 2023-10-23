import { Shop } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';

export class ShopEntity implements Shop {
  constructor(partial: Partial<ShopEntity>) {
    Object.assign(this, partial);
  }

  businessName: string;

  id: number;
  userId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
