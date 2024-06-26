import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import {
  CustomerEntity,
  CustomerReviewEntity,
  FavoriteProductEntity,
  FavoriteShopEntity,
} from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { ScheduledPickupEntity } from '../orders/entities/scheduled-pickup.entity';
import { OrderEntity } from '../orders/entities';

export type CustomerSubjects = InferSubjects<
  | typeof CustomerEntity
  | typeof CustomerReviewEntity
  | typeof FavoriteProductEntity
  | typeof FavoriteShopEntity
  | typeof ScheduledPickupEntity
  | typeof OrderEntity
>;

export const permissions: Permissions<
  UserRole,
  CustomerSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.manage, CustomerEntity, {
      id: user.customer?.id,
    });
    can(Actions.read, CustomerReviewEntity);
  },
  Customer({ can, user }) {
    can(Actions.manage, FavoriteProductEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.manage, FavoriteShopEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.read, ScheduledPickupEntity, {
      'order.customerId': user.customer?.id,
    });
    can(Actions.read, OrderEntity, { customerId: { $eq: user.customer?.id } });
  },
  Courier({ can, extend }) {
    extend(UserRole.Customer);
    can(Actions.read, CustomerEntity, {
      '_count.orders': { $ne: 0 },
    });
  },
  Shop({ extend, can, user }) {
    extend(UserRole.Courier);
    can(Actions.aggregate, CustomerEntity, {
      '_count.orders': { $ne: 0 },
    });
    can(Actions.manage, CustomerReviewEntity, { shopId: user.shop?.id });
  },
};
