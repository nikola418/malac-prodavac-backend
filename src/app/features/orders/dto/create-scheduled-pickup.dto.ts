import { $Enums } from '@prisma/client';
import { IsEnum, Matches } from 'class-validator';
import { timeOfDayRegex } from '../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduledPickupDto {
  @Matches(timeOfDayRegex)
  timeOfDay: string;
  @ApiProperty({ enum: $Enums.Workday })
  @IsEnum($Enums.Workday)
  day: $Enums.Workday;
}
