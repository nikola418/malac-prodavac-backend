import { Buyer } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';

export class BuyerEntity implements Buyer {
  constructor(partial: Partial<BuyerEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
