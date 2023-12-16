import { UserRole } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import {
  ProductEntity,
  ProductMediaEntity,
  ProductQuestionAnswerEntity,
  ProductQuestionEntity,
  ProductReviewReplyEntity,
} from './entities';
import { ProductReviewEntity } from './entities/product-review.entity';

export type ProductSubjects = InferSubjects<
  | typeof ProductEntity
  | typeof ProductMediaEntity
  | typeof ProductReviewEntity
  | typeof ProductReviewReplyEntity
  | typeof ProductQuestionEntity
  | typeof ProductQuestionAnswerEntity
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
    can(Actions.manage, ProductQuestionEntity, {
      customerId: { $eq: user.customer?.id },
    });
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
    can(Actions.manage, ProductQuestionAnswerEntity, {
      shopId: { $eq: user.shop?.id },
    });
  },
};
