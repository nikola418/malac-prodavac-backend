import { UpdateUserDto } from '../../users/dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBuyerDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
