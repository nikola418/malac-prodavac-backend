import { UpdateUserDto } from '../../users/dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShopDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
