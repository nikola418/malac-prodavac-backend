import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Deliverer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { DecimalToNumber } from '../../../common/decorators';

export class DelivererEntity implements Deliverer {
  constructor(partial: Partial<DelivererEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  @DecimalToNumber()
  pricePerKilometer: Decimal;
  @ApiProperty({ enum: $Enums.Currency })
  currency: $Enums.Currency;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;
}
