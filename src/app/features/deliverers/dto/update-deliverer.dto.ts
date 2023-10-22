import { Type } from 'class-transformer';
import {
  IsOptional,
  ValidateNested,
  IsPositive,
  IsObject,
} from 'class-validator';
import { UpdateUserDto } from '../../users/dto';

export class UpdateDelivererDto {
  @IsOptional()
  @IsPositive()
  pricePerKilometer?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
