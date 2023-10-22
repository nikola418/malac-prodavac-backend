import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { DelivererEntity } from './entities';
import { DeliverersService } from './deliverers.service';

@Injectable()
export class DeliverersHook
  implements SubjectBeforeFilterHook<DelivererEntity, Request>
{
  constructor(readonly deliverersService: DeliverersService) {}

  run({ params }: Request) {
    return this.deliverersService.findOne({ id: +params.id });
  }
}
