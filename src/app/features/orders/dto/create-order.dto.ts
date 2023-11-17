import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  productId: number;

  @ApiProperty({ enum: $Enums.DeliveryMethod })
  @IsEnum($Enums.DeliveryMethod)
  deliveryMethod: $Enums.DeliveryMethod;

  @ApiProperty({ enum: $Enums.PaymentMethod })
  @IsEnum($Enums.PaymentMethod)
  paymentMethod: $Enums.PaymentMethod;

  @IsPositive()
  quantity: number;
}
