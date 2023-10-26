import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { ProductEntity, ProductMediaEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type ProductSubjects = InferSubjects<typeof ProductEntity>;

export const permissions: Permissions<
  UserRole,
  ProductSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, ProductEntity);
  },
  Shop({ can, user }) {
    can(Actions.manage, ProductEntity, {
      shopId: user.shop?.id,
    });
    can(Actions.manage, ProductMediaEntity, {
      product: { shopId: user.shop?.id },
    });
  },
};
