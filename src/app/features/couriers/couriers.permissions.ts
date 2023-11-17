import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { CourierEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type CourierSubjects = InferSubjects<typeof CourierEntity>;

export const permissions: Permissions<
  UserRole,
  CourierSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can, user }) {
    can(Actions.manage, CourierEntity, {
      id: user.courier?.id,
    });
  },
  Customer({ can }) {
    can(Actions.read, CourierEntity, {
      '_count.orders': { $ne: 0 },
    });
  },
  Courier({ extend }) {
    extend(UserRole.Customer);
  },
  Shop({ extend }) {
    extend(UserRole.Customer);
  },
};
