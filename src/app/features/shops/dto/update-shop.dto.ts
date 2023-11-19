import { UpdateUserDto } from '../../users/dto';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { $Enums } from '.prisma/client';
import { timeOfDayRegex } from '../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShopDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @Matches(timeOfDayRegex)
  openFrom: string;

  @IsOptional()
  @Matches(timeOfDayRegex)
  openTill: string;

  @IsOptional()
  @ApiProperty({ enum: $Enums.Workday })
  @IsEnum($Enums.Workday)
  openFromDays: $Enums.Workday;

  @IsOptional()
  @ApiProperty({ enum: $Enums.Workday })
  @IsEnum($Enums.Workday)
  openTillDays: $Enums.Workday;

  @IsOptional()
  @IsString()
  availableAt: string;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  availableAtLatitude: number;

  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  availableAtLongitude: number;
}
