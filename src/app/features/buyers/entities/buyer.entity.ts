import { $Enums } from '.prisma/client';
import { Buyer } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BuyerEntity implements Buyer {
  constructor(partial: Partial<BuyerEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  @ApiProperty({ enum: $Enums.PaymentMethod })
  paymentMethod: $Enums.PaymentMethod;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
