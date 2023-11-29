import { SubjectBeforeFilterHook } from 'nest-casl';
import { OrderEntity } from '../../orders/entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { CourierOrdersService } from '../services';

@Injectable()
export class CourierOrdersHook
  implements SubjectBeforeFilterHook<OrderEntity, AuthorizableRequest>
{
  constructor(private courierOrdersService: CourierOrdersService) {}

  run({ params }: AuthorizableRequest) {
    return this.courierOrdersService.findOne({
      id: +params.orderId,
      courierId: +params.id,
    });
  }
}
