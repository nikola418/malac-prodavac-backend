import { $Enums, Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { ShopEntity } from '../../shops/entities';
import { Type } from 'class-transformer';
import { CategoryEntity } from '../../categories/entities';
import { ProductReviewEntity } from './product-review.entity';
import { ProductMediaEntity } from './product-media.entity';

export class ProductEntity implements Product {
  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  shopId: number;
  title: string;
  desc: string;
  @DecimalToNumber()
  price: Decimal;
  available: boolean;
  @ApiProperty({ enum: $Enums.ProductMeasurementUnit })
  unitOfMeasurement: $Enums.ProductMeasurementUnit;
  @DecimalToNumber()
  rating: Decimal;
  ratingsCount: number;
  availableAt: string;
  @DecimalToNumber()
  availableAtLatitude: Decimal;
  @DecimalToNumber()
  availableAtLongitude: Decimal;
  @DecimalToNumber()
  availableFromHours: Decimal;
  @DecimalToNumber()
  availableTillHours: Decimal;
  categoryId: number;
  @ApiProperty({ enum: $Enums.Currency })
  currency: $Enums.Currency;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ShopEntity)
  shop?: ShopEntity;

  @Type(() => CategoryEntity)
  category?: CategoryEntity;

  @Type(() => ProductReviewEntity)
  reviews?: ProductReviewEntity[];

  @Type(() => ProductMediaEntity)
  productMedias?: ProductMediaEntity[];

  _count?: any;
}
