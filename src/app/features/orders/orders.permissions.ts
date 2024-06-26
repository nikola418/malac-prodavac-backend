import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { OrderEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { OrderStatus, UserRole } from '@prisma/client';
import { ProductEntity } from '../products/entities';
import { ScheduledPickupEntity } from './entities/scheduled-pickup.entity';

export type OrderSubjects = InferSubjects<
  typeof OrderEntity | typeof ScheduledPickupEntity
>;

export const permissions: Permissions<
  UserRole,
  OrderSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({}) {},
  Customer({ can, user }) {
    can(Actions.aggregate, ProductEntity, { shopId: { $ne: user.shop?.id } });
    can(Actions.create, OrderEntity);
    can(Actions.read, OrderEntity, { customerId: { $eq: user.customer?.id } });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      customerId: { $eq: user.customer?.id },
      orderStatus: { $eq: OrderStatus.InDelivery },
      accepted: { $eq: true },
    });
    can(Actions.delete, OrderEntity, {
      customerId: { $eq: user.customer?.id },
      orderStatus: { $eq: OrderStatus.Ordered },
    });
    can(Actions.aggregate, OrderEntity, { customerId: user.customer?.id });
    can(Actions.create, ScheduledPickupEntity);
  },
  Courier({ can, extend, user }) {
    extend(UserRole.Customer);
    can(Actions.read, OrderEntity, {
      accepted: { $eq: true },
      courierId: { $eq: user.courier?.id },
    });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      courierId: { $eq: user.courier?.id },
      accepted: { $eq: true },
    });
  },
  Shop({ can, extend, user }) {
    extend(UserRole.Courier);
    can(Actions.read, OrderEntity, {
      'product.shopId': { $eq: user.shop?.id },
    });
    can(Actions.update, OrderEntity, ['accepted'], {
      'product.shopId': { $eq: user.shop?.id },
      orderStatus: { $eq: OrderStatus.Ordered },
      accepted: { $eq: false },
    });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      'product.shopId': { $eq: user.shop?.id },
      orderStatus: { $eq: OrderStatus.Ordered },
      accepted: { $eq: true },
    });
    can(Actions.update, OrderEntity, ['courierId'], {
      accepted: { $eq: true },
      'product.shopId': { $eq: user.shop?.id },
    });
    can(Actions.delete, OrderEntity, {
      'product.shopId': { $eq: user.shop?.id },
      orderStatus: { $eq: OrderStatus.Ordered },
    });
    can(Actions.update, ScheduledPickupEntity, {
      'order.product.shopId': { $eq: user.shop?.id },
    });
  },
};
