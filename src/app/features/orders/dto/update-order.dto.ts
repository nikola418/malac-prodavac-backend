import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @ApiProperty({ enum: $Enums.OrderStatus })
  @IsEnum($Enums.OrderStatus)
  orderStatus: $Enums.OrderStatus;

  @IsOptional()
  @IsBoolean()
  accepted?: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  courierId: number;
}
