import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { SellerEntity } from './entities';
import { SellersService } from './sellers.service';

@Injectable()
export class SellersHook
  implements SubjectBeforeFilterHook<SellerEntity, Request>
{
  constructor(readonly sellersService: SellersService) {}

  run({ params }: Request) {
    return this.sellersService.findOne({ id: +params.id });
  }
}
