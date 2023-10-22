import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';

import { BuyerEntity } from './entities';
import { BuyersService } from './buyers.service';

@Injectable()
export class BuyersHook
  implements SubjectBeforeFilterHook<BuyerEntity, Request>
{
  constructor(readonly buyersService: BuyersService) {}

  run({ params }: Request) {
    return this.buyersService.findOne({ id: +params.id });
  }
}
