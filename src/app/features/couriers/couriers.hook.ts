import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CourierEntity } from './entities';
import { CouriersService } from './couriers.service';
import { AuthorizableRequest } from '../../core/authentication/jwt';

@Injectable()
export class CouriersHook
  implements SubjectBeforeFilterHook<CourierEntity, AuthorizableRequest>
{
  constructor(readonly couriersService: CouriersService) {}

  run({ params, user }: AuthorizableRequest) {
    return this.couriersService.findOne(
      { id: +params.id },
      {
        _count: {
          select: {
            orders: {
              where: {
                OR: [
                  {
                    product: { shopId: user.shop?.id },
                  },
                  {
                    customerId: user.customer?.id,
                  },
                ],
              },
            },
          },
        },
      },
    );
  }
}
