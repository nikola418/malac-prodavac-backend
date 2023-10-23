import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { CustomerEntity } from './entities';
import { CustomersService } from './customers.service';

@Injectable()
export class CustomersHook
  implements SubjectBeforeFilterHook<CustomerEntity, Request>
{
  constructor(readonly customersService: CustomersService) {}

  run({ params }: Request) {
    return this.customersService.findOne({ id: +params.id });
  }
}
