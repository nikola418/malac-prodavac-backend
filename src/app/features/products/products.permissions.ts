import { Permissions, Actions, InferSubjects } from 'nest-casl';
import { UserRole } from '@prisma/client';
import {
  ProductEntity,
  ProductMediaEntity,
  ProductReviewReplyEntity,
} from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { ProductReviewEntity } from './entities/product-review.entity';

export type ProductSubjects = InferSubjects<
  | typeof ProductEntity
  | typeof ProductMediaEntity
  | typeof ProductReviewEntity
  | typeof ProductReviewReplyEntity
>;

export const permissions: Permissions<
  UserRole,
  ProductSubjects,
  Actions,
  JWTPayloadUser
> = {
  everyone({ can }) {
    can(Actions.read, ProductEntity);
    can(Actions.read, ProductReviewEntity);
    can(Actions.read, ProductReviewReplyEntity);
  },
  Customer({ can, user }) {
    can(Actions.aggregate, ProductEntity, { '_count.orders': { $ne: 0 } });
    can(Actions.manage, ProductReviewEntity, { customerId: user.customer?.id });
  },
  Courier({ extend }) {
    extend(UserRole.Customer);
  },
  Shop({ can, extend, user }) {
    extend(UserRole.Courier);
    can(Actions.manage, ProductEntity, {
      shopId: user.shop?.id,
    });
    can(Actions.manage, ProductMediaEntity, {
      product: { shopId: user.shop?.id },
    });
    can(Actions.aggregate, ProductReviewEntity, {
      'product.shopId': { $eq: user.shop?.id },
    });
    can(Actions.manage, ProductReviewReplyEntity, {
      shopId: user.shop?.id,
    });
  },
};
