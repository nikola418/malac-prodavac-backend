import { SubjectBeforeFilterHook } from 'nest-casl';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { FavoriteShopsService } from '../services';
import { FavoriteShopEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteShopsHook
  implements SubjectBeforeFilterHook<FavoriteShopEntity, AuthorizableRequest>
{
  constructor(private favoriteShopsService: FavoriteShopsService) {}

  run({ params }: AuthorizableRequest) {
    return this.favoriteShopsService.findOne({ id: +params.favoriteShopId });
  }
}
