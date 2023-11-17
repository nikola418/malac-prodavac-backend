import { $Enums, Shop } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { ProductEntity } from '../../products/entities';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class ShopEntity implements Shop {
  constructor(partial: Partial<ShopEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  businessName: string;
  @DecimalToNumber()
  openFromHours: Decimal;
  @DecimalToNumber()
  openTillHours: Decimal;
  @ApiProperty({ enum: $Enums.Workday })
  openFromDays: $Enums.Workday;
  @ApiProperty({ enum: $Enums.Workday })
  openTillDays: $Enums.Workday;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;

  @Type(() => ProductEntity)
  products?: ProductEntity[];
}
