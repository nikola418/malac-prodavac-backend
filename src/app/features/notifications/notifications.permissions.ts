import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { NotificationEntity, NotificationPayloadEntity } from './entities';
import { UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type NotificationSubjects = InferSubjects<
  typeof NotificationEntity | typeof NotificationPayloadEntity
>;

export const permissions: Permissions<
  UserRole,
  NotificationSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.read, NotificationEntity, { id: user.id });
  },
  Customer() {},
  Courier({ extend }) {
    extend(UserRole.Customer);
  },
  Shop({ extend }) {
    extend(UserRole.Courier);
  },
};
