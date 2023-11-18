import { NotificationPayload, Prisma } from '@prisma/client';

export class NotificationPayloadEntity implements NotificationPayload {
  constructor(partial: Partial<NotificationPayloadEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  payload: Prisma.JsonValue;
  updatedAt: Date;
  createdAt: Date;
}
