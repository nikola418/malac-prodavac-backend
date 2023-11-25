import { ScheduledPickup } from '@prisma/client';

export class ScheduledPickupEntity implements ScheduledPickup {
  constructor(partial: Partial<ScheduledPickupEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  orderId: number;
  timeOfDay: string;
  date: string;
  accepted: boolean;
  updatedAt: Date;
  createdAt: Date;
}
