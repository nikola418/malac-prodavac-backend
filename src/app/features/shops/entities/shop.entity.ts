import { $Enums, Shop } from '@prisma/client';
import { UserEntity } from '../../users/entities';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';
import { WithIsFavored } from '../../../core/prisma';
import { ProductEntity } from '../../products/entities';
import { FavoriteShopEntity } from '../../customers/entities';

export class ShopEntity implements Shop, WithIsFavored<Shop> {
  constructor(partial: Partial<ShopEntity>) {
    Object.assign(this, partial);
  }

  isFavored?: boolean = undefined;
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

  @Type(() => FavoriteShopEntity)
  favoriteShops?: FavoriteShopEntity[];
}
