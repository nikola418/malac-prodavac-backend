import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { ShopEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { ScheduledPickupEntity } from '../orders/entities';

export type ShopSubjects = InferSubjects<
  typeof ShopEntity | typeof ScheduledPickupEntity
>;

export const permissions: Permissions<
  UserRole,
  ShopSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.manage, ShopEntity, { id: user.shop?.id });
    can(Actions.read, ShopEntity);
  },
  Customer({}) {},
  Courier({ extend }) {
    extend(UserRole.Customer);
  },
  Shop({ can, extend, user }) {
    extend(UserRole.Courier);
    can(Actions.read, ScheduledPickupEntity, {
      'order.product.shopId': user.shop?.id,
    });
  },
};
