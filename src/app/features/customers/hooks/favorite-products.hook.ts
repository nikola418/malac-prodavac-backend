import { SubjectBeforeFilterHook } from 'nest-casl';
import { FavoriteProductEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { FavoriteProductsService } from '../services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteProductsHook
  implements
    SubjectBeforeFilterHook<FavoriteProductEntity, AuthorizableRequest>
{
  constructor(private favoriteProductsService: FavoriteProductsService) {}

  run({ params }: AuthorizableRequest) {
    return this.favoriteProductsService.findOne({
      id: +params.favoriteProductId,
    });
  }
}
