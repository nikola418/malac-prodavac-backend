import { Type } from 'class-transformer';
import {
  IsOptional,
  ValidateNested,
  IsObject,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { UpdateUserDto } from '../../users/dto';

export class UpdateCourierDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  routeStartLatitude: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  routeStartLongitude: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  routeEndLatitude: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  routeEndLongitude: number;
}
