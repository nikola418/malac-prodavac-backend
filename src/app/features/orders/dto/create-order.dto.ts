import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class OrderProductDto {
  @IsPositive()
  @IsInt()
  productId: number;

  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested()
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @ApiProperty({ enum: $Enums.DeliveryMethod })
  @IsEnum($Enums.DeliveryMethod)
  deliveryMethod: $Enums.DeliveryMethod;

  @IsDate()
  timeOfSelfPickup: Date;
}
