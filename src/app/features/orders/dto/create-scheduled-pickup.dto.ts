import { IsString } from 'class-validator';

export class CreateScheduledPickupDto {
  @IsString()
  timeOfDay: string;

  @IsString()
  date: string;
}
