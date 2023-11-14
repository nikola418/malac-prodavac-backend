import { OrderProduct } from '@prisma/client';
import { ProductEntity } from '../../products/entities';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { DecimalToNumber } from '../../../common/decorators';

export class OrderProductEntity implements OrderProduct {
  constructor(partial: Partial<OrderProductEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  productId: number;
  orderId: number;
  @DecimalToNumber()
  quantity: Decimal;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductEntity)
  product?: ProductEntity;
}
