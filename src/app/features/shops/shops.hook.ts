import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { ShopEntity } from './entities';
import { ShopsService } from './shops.service';
import { AuthorizableRequest } from '../../core/authentication/jwt';

@Injectable()
export class ShopsHook
  implements SubjectBeforeFilterHook<ShopEntity, AuthorizableRequest>
{
  constructor(readonly shopsService: ShopsService) {}

  run({ params, user }: AuthorizableRequest) {
    return this.shopsService.findOne(
      { id: +params.id },
      {
        _count: {
          select: {
            products: {
              where: {
                orders: {
                  some: {
                    OR: [
                      { courierId: user.courier?.id },
                      { customerId: user.customer?.id },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    );
  }
}
