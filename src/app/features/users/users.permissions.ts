import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { UserEntity, UserMediaEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type UserSubjects = InferSubjects<
  typeof UserEntity | typeof UserMediaEntity
>;

export const permissions: Permissions<
  UserRole,
  UserSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.manage, UserEntity, { id: user.id });
    can(Actions.manage, UserMediaEntity, { userId: user.id });
  },
  Customer({}) {},
  Courier({ can, extend }) {
    extend(UserRole.Customer);
    can(Actions.read, UserEntity, {
      customer: { $ne: null },
    });
    can(Actions.read, UserMediaEntity, { customer: { $ne: null } });
  },
  Shop({ extend }) {
    extend(UserRole.Courier);
  },
};
