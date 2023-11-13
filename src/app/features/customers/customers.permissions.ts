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
  Customer({ can, user }) {
    can(Actions.read, CustomerEntity);
    can(Actions.aggregate, CustomerEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.manage, FavoriteProductEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.manage, FavoriteShopEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.manage, CustomerEntity, {
      id: user.customer?.id,
    });
  },
  Courier({ can }) {
    can(Actions.read, CustomerEntity);
  },
  Shop({ can, cannot }) {
    can(Actions.read, CustomerEntity, {});
    cannot(Actions.read, CustomerEntity, { orders: { $size: 0 } });
  },
};
