import { SubjectBeforeFilterHook } from 'nest-casl';
import { UserEntity } from './entities';
import { AuthorizableRequest } from '../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UsersHook
  implements SubjectBeforeFilterHook<UserEntity, AuthorizableRequest>
{
  constructor(readonly usersService: UsersService) {}

  run({ params }: AuthorizableRequest) {
    return this.usersService.findOne({ id: +params.id });
  }
}
