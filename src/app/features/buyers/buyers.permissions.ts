import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { BuyerEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type BuyerSubjects = InferSubjects<typeof BuyerEntity>;

export const permissions: Permissions<
  UserRole,
  BuyerSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, BuyerEntity);
  },
  Buyer({ can, user }) {
    can(Actions.manage, BuyerEntity, {
      id: user.buyer?.id,
    });
  },
};
