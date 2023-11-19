import { $Enums, ScheduledPickup } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduledPickupEntity implements ScheduledPickup {
  constructor(partial: Partial<ScheduledPickupEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  orderId: number;
  timeOfDay: string;
  @ApiProperty({ enum: $Enums.Workday })
  day: $Enums.Workday;
  accepted: boolean;
  updatedAt: Date;
  createdAt: Date;
}
