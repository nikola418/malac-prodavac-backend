import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { OrderEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { UserRole } from '@prisma/client';

export type OrderSubjects = InferSubjects<typeof OrderEntity>;

export const permissions: Permissions<
  UserRole,
  OrderSubjects,
  Actions,
  JWTPayloadUser
> = {
  Customer({ can, user }) {
    can(Actions.create, OrderEntity);
    can(Actions.read, OrderEntity, { customerId: user.id });
  },
  Courier({ can, user }) {
    can(Actions.read, OrderEntity, {
      courierId: { $eq: user.courier?.id },
    });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      product: { shopId: { $eq: user.shop?.id } },
    });
  },
  Shop({ can, user }) {
    can(Actions.read, OrderEntity, {
      product: { shopId: { $eq: user.shop?.id } },
    });
    can(Actions.update, OrderEntity, ['orderStatus'], {
      product: { shopId: { $eq: user.shop?.id } },
    });
  },
};
