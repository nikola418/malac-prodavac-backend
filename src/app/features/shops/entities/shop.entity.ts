import { $Enums, Shop } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { ProductEntity } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';

export class ShopEntity implements Shop {
  constructor(partial: Partial<ShopEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  businessName: string;
  openFrom: string;
  openTill: string;
  @ApiProperty({ enum: $Enums.Workday })
  openFromDays: $Enums.Workday;
  @ApiProperty({ enum: $Enums.Workday })
  openTillDays: $Enums.Workday;
  availableAt: string;
  @DecimalToNumber()
  availableAtLatitude: Decimal;
  @DecimalToNumber()
  availableAtLongitude: Decimal;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => UserEntity)
  user?: UserEntity;

  @Type(() => ProductEntity)
  products?: ProductEntity[];
}
