import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { ChatEntity, ChatMessageEntity } from './entities';
import { UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type ChatSubjects = InferSubjects<
  typeof ChatEntity | typeof ChatMessageEntity
>;

export const permissions: Permissions<
  UserRole,
  ChatSubjects,
  Actions,
  JWTPayloadUser
> = {
  Customer({ can, user }) {
    can(Actions.read, ChatEntity, {
      customerId: { $eq: user.customer?.id },
    });
    can(Actions.create, ChatMessageEntity);
    can(Actions.read, ChatMessageEntity, {
      customerId: { $eq: user.customer?.id },
    });
  },
  Shop({ can, user }) {
    can(Actions.read, ChatEntity, {
      shopId: { $eq: user.shop?.id },
    });
    can(Actions.create, ChatMessageEntity);
    can(Actions.read, ChatMessageEntity, {
      shopId: { $eq: user.shop?.id },
    });
  },
};
