import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { CustomerEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type CustomerSubjects = InferSubjects<typeof CustomerEntity>;

export const permissions: Permissions<
  UserRole,
  CustomerSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, CustomerEntity);
  },
  Customer({ can, user }) {
    can(Actions.manage, CustomerEntity, {
      id: user.customer?.id,
    });
  },
  Shop({ cannot, user }) {
    cannot(Actions.read, CustomerEntity, {
      orders: { some: { product: { ownerId: { not: user.shop.id } } } },
    });
  },
};
