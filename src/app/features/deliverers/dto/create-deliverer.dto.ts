import {
  IsObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto';
import { Type } from 'class-transformer';

export class CreateDelivererDto {
  @IsOptional()
  @IsPositive()
  pricePerKilometer?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
