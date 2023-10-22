import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { UserEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type UserSubjects = InferSubjects<typeof UserEntity>;

export const permissions: Permissions<
  UserRole,
  UserSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, UserEntity);
  },
};
