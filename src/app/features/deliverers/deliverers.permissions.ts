import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { DelivererEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type DelivererSubjects = InferSubjects<typeof DelivererEntity>;

export const permissions: Permissions<
  UserRole,
  DelivererSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, DelivererEntity);
  },
  Deliverer({ can, user }) {
    can(Actions.manage, DelivererEntity, {
      id: user.deliverer?.id,
    });
  },
};
