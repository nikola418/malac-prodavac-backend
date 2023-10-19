import { UserEntity } from '../../../features/users/entities';

export type JWTPayloadUser = Partial<Omit<UserEntity, 'password'>>;
export type JwtPayload = { user: JWTPayloadUser };
