import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { ShopEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type ShopSubjects = InferSubjects<typeof ShopEntity>;

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
  Shop({ extend }) {
    extend(UserRole.Courier);
  },
};
