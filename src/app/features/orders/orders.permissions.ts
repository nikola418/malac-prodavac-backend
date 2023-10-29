import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { OrderEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { OrderStatus, UserRole } from '@prisma/client';

export type OrderSubjects = InferSubjects<typeof OrderEntity>;

export const permissions: Permissions<
  UserRole,
  OrderSubjects,
  Actions,
  JWTPayloadUser
> = {
  Customer({ can, user }) {
    can(Actions.create, OrderEntity);
    can(Actions.read, OrderEntity, { customerId: user.id });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      customerId: user.id,
      accepted: { $eq: true },
    });
  },
  Courier({ can, user }) {
    can(Actions.read, OrderEntity, {
      courierId: { $eq: user.courier?.id },
    });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      'product.shopId': { $eq: user.shop?.id },
      accepted: { $eq: true },
    });
  },
  Shop({ can, user }) {
    can(Actions.read, OrderEntity, {
      'product.id': { $eq: 1 },
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
  },
};
