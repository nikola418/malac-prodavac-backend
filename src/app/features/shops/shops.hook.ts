import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { ShopEntity } from './entities';
import { ShopsService } from './shops.service';

@Injectable()
export class ShopsHook implements SubjectBeforeFilterHook<ShopEntity, Request> {
  constructor(readonly shopsService: ShopsService) {}

  run({ params }: Request) {
    return this.shopsService.findOne({ id: +params.id });
  }
}
