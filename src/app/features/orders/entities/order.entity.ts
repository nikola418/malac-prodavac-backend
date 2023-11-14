import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Order } from '@prisma/client';
import { CustomerEntity } from '../../customers/entities';
import { CourierEntity } from '../../couriers/entities';
import { Type } from 'class-transformer';
import { OrderProductEntity } from './order-product.entity';

export class OrderEntity implements Order {
  constructor(partial: Partial<OrderEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  customerId: number;
  courierId: number;
  accepted: boolean;
  @ApiProperty({ enum: $Enums.OrderStatus })
  orderStatus: $Enums.OrderStatus;
  @ApiProperty({ enum: $Enums.DeliveryMethod })
  deliveryMethod: $Enums.DeliveryMethod;
  timeOfSelfPickup: Date;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => OrderProductEntity)
  orderProducts?: OrderProductEntity[];
  @Type(() => CustomerEntity)
  customer?: CustomerEntity;
  @Type(() => CourierEntity)
  courier?: CourierEntity;
}
