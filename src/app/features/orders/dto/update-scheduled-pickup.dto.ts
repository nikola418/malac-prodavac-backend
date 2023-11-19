import { IsBoolean } from 'class-validator';

export class UpdateScheduledPickupDto {
  @IsBoolean()
  accepted: boolean;
}
