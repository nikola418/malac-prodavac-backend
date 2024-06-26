import { SubjectBeforeFilterHook } from 'nest-casl';
import { UserMediaEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { UserMediasService } from '../services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMediasHook
  implements SubjectBeforeFilterHook<UserMediaEntity, AuthorizableRequest>
{
  constructor(private userMediasService: UserMediasService) {}

  run({ params }: AuthorizableRequest) {
    return this.userMediasService.findOne({
      userId: +params.id,
      id: +params.mediaId,
    });
  }
}
