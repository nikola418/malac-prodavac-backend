import { UpdateUserDto } from '../../users/dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCustomerDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
