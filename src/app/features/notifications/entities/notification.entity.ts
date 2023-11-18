import { Notification } from '@prisma/client';
import { NotificationPayloadEntity } from './notification-payload.entity';
import { Type } from 'class-transformer';

export class NotificationEntity implements Notification {
  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: number;
  notificationPayloadId: number;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => NotificationPayloadEntity)
  notificationPayload?: NotificationPayloadEntity;
}
