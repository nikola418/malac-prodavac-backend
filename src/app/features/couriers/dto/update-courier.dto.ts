import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsObject } from 'class-validator';
import { UpdateUserDto } from '../../users/dto';

export class UpdateCourierDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
