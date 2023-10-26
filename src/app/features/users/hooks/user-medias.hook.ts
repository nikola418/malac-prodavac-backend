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

  async run({ params, user }: AuthorizableRequest) {
    const res = await this.userMediasService.findOne(
      {
        id: +params.mediaId,
      },
      {
        user: {
          include: {
            customer: {
              where: {
                orders: { some: { product: { shopId: +user.shop.id } } },
              },
            },
          },
        },
      },
    );
    console.log(res);
    return res;
  }
}
