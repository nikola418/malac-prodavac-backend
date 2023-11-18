import { SubjectBeforeFilterHook } from 'nest-casl';
import { NotificationEntity } from './entities';
import { AuthorizableRequest } from '../../core/authentication/jwt';
import { NotificationsService } from './services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsHook
  implements SubjectBeforeFilterHook<NotificationEntity, AuthorizableRequest>
{
  constructor(private notificationsService: NotificationsService) {}

  run({ params }: AuthorizableRequest) {
    return this.notificationsService.findOne({ id: +params.id });
  }
}
