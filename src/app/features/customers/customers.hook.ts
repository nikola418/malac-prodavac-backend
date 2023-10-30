import { Injectable } from '@nestjs/common';
import { SubjectBeforeFilterHook } from 'nest-casl';
import { CustomerEntity } from './entities';
import { CustomersService } from './customers.service';
import { AuthorizableRequest } from '../../core/authentication/jwt';

@Injectable()
export class CustomersHook
  implements SubjectBeforeFilterHook<CustomerEntity, AuthorizableRequest>
{
  constructor(readonly customersService: CustomersService) {}

  async run({ params, user }: AuthorizableRequest) {
    const res = await this.customersService.findOne(
      { id: +params.id },
      {
        orders: { where: { product: { shopId: user.shop?.id } } },
      },
    );
    console.log(res);
    return res;
  }
}
