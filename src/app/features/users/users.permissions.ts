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
  everyone({ can, user }) {
    can(Actions.read, UserEntity);
    can(Actions.delete, UserEntity, { id: user.id });
  },
  Shop({ cannot }) {
    cannot(Actions.read, UserEntity).because(
      "As a Shop owner you can't read all users",
    );
  },
};
