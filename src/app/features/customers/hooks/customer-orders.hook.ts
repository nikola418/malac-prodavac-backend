import { SubjectBeforeFilterHook } from 'nest-casl';
import { OrderEntity } from '../../orders/entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { CustomerOrdersService } from '../services';

@Injectable()
export class CustomerOrdersHook
  implements SubjectBeforeFilterHook<OrderEntity, AuthorizableRequest>
{
  constructor(private customerOrders: CustomerOrdersService) {}

  run({ params }: AuthorizableRequest) {
    return this.customerOrders.findOne({
      id: +params.orderId,
      customerId: +params.id,
    });
  }
}
