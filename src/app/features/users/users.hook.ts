import { SubjectBeforeFilterHook } from 'nest-casl';
import { UserEntity } from './entities';
import { AuthorizableRequest } from '../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from './services/users.service';

@Injectable()
export class UsersHook
  implements SubjectBeforeFilterHook<UserEntity, AuthorizableRequest>
{
  constructor(readonly usersService: UsersService) {}

  async run({ params, route }: AuthorizableRequest) {
    if ((route.path as string).split('/').includes('medias'))
      return this.usersService.findFirst(
        {
          id: +params.id,
        },
        {
          customer: {
            where: { orders: { some: { product: { shopId: +params.id } } } },
          },
        },
      );

    return this.usersService.findOne(
      { id: +params.id },
      { customer: { include: { orders: true } } },
    );
  }
}
