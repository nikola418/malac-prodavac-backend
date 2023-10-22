import { UpdateUserDto } from '../../users/dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSellerDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
