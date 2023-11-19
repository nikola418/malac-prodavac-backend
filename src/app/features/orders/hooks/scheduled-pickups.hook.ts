import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { ScheduledPickupEntity } from '../entities/scheduled-pickup.entity';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ScheduledPickupsService } from '../services';

@Injectable()
export class ScheduledPickupsHook
  implements
    SubjectBeforeFilterHook<ScheduledPickupEntity, AuthorizableRequest>
{
  constructor(private scheduledPickupsService: ScheduledPickupsService) {}

  run({ params }: AuthorizableRequest) {
    return this.scheduledPickupsService.findOne(
      {
        id: +params.scheduledPickupId,
      },
      { order: { include: { product: true } } },
    );
  }
}
