import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CustomerEntity } from '../entities';
import { CustomersService } from '../services/customers.service';
import { AuthorizableRequest } from '../../../core/authentication/jwt';

@Injectable()
export class CustomersHook
  implements SubjectBeforeFilterHook<CustomerEntity, AuthorizableRequest>
{
  constructor(readonly customersService: CustomersService) {}

  run({ params, user }: AuthorizableRequest) {
    return this.customersService.findOne(
      { id: +params.id },
      {
        orders: {
          where: {
            orderProducts: { some: { product: { shopId: user.shop?.id } } },
          },
        },
      },
    );
  }
}
