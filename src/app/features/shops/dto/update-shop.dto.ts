import { UpdateUserDto } from '../../users/dto';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Matches,
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
}
