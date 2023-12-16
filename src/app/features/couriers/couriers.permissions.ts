import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { CourierEntity, CourierReviewEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { OrderEntity } from '../orders/entities';

export type CourierSubjects = InferSubjects<
  typeof CourierEntity | typeof OrderEntity | typeof CourierReviewEntity
>;

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
    can(Actions.read, CourierEntity);
  },
  Customer({}) {
    // can(Actions.read, CourierEntity, {
    //   '_count.orders': { $ne: 0 },
    // });
  },
  Courier({ can, user, extend }) {
    extend(UserRole.Customer);
    can(Actions.read, OrderEntity, { courierId: { $eq: user.courier?.id } });
  },
  Shop({ extend, can, user }) {
    extend(UserRole.Customer);
    can(Actions.aggregate, CourierEntity, {
      '_count.orders': { $ne: 0 },
    });
    can(Actions.manage, CourierReviewEntity, { shopId: user.shop?.id });
  },
};
