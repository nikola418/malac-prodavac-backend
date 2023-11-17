import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import {
  CustomerEntity,
  FavoriteProductEntity,
  FavoriteShopEntity,
} from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type CustomerSubjects = InferSubjects<
  | typeof CustomerEntity
  | typeof FavoriteProductEntity
  | typeof FavoriteShopEntity
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
  },
  Customer({ can, user }) {
    can(Actions.manage, FavoriteProductEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.manage, FavoriteShopEntity, {
      customerId: { $eq: user.customer?.id },
    });
  },
  Courier({ can, extend }) {
    extend(UserRole.Customer);
    can(Actions.read, CustomerEntity, {
      '_count.orders': { $ne: 0 },
    });
  },
  Shop({ extend }) {
    extend(UserRole.Courier);
  },
};
