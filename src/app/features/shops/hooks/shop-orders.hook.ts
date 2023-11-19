import { SubjectBeforeFilterHook } from 'nest-casl';
import { OrderEntity } from '../../orders/entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { ShopOrdersService } from '../services';

@Injectable()
export class ShopOrdersHook
  implements SubjectBeforeFilterHook<OrderEntity, AuthorizableRequest>
{
  constructor(private ShopOrders: ShopOrdersService) {}

  run({ params }: AuthorizableRequest) {
    return this.ShopOrders.findOne({
      id: +params.orderId,
      product: { shopId: +params.id },
    });
  }
}
