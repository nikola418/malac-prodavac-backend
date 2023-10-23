import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { CourierEntity } from './entities';
import { CouriersService } from './couriers.service';

@Injectable()
export class CouriersHook
  implements SubjectBeforeFilterHook<CourierEntity, Request>
{
  constructor(readonly couriersService: CouriersService) {}

  run({ params }: Request) {
    return this.couriersService.findOne({ id: +params.id });
  }
}
