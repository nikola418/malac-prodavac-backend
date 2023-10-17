import { Seller } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';

export class SellerEntity implements Seller {
  constructor(partial: Partial<SellerEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
