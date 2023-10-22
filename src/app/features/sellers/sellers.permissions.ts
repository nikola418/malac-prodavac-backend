import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { SellerEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type SellerSubjects = InferSubjects<typeof SellerEntity>;

export const permissions: Permissions<
  UserRole,
  SellerSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, SellerEntity);
  },
  Seller({ can, user }) {
    can(Actions.manage, SellerEntity, {
      id: user.seller?.id,
    });
  },
};
