import { IsObject, ValidateNested } from 'class-validator';
import { CreateUserDto } from '../../users/dto';
import { Type } from 'class-transformer';

export class CreateBuyerDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
