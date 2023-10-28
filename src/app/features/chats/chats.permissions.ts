import { UserRole } from '@prisma/client';
import { Actions, InferSubjects, Permissions } from 'nest-casl';
import { ChatEntity, ChatMessageEntity } from './entities';
import { JWTPayloadUser } from '../../core/authentication/jwt';

export type ChatSubjects = InferSubjects<
  typeof ChatEntity | typeof ChatMessageEntity
>;

export const permissions: Permissions<
  UserRole,
  ChatSubjects,
  Actions,
  JWTPayloadUser
> = {};
