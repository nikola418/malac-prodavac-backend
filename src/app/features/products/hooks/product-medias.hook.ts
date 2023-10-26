import { SubjectBeforeFilterHook } from 'nest-casl';
import { ProductMediaEntity } from '../entities';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ProductMediasService } from '../services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductMediasHook
  implements SubjectBeforeFilterHook<ProductMediaEntity, AuthorizableRequest>
{
  constructor(private productMediasService: ProductMediasService) {}

  async run({ params }: AuthorizableRequest) {
    const res = await this.productMediasService.findOne(
      {
        id: +params.mediaId,
      },
      { product: true },
    );
    console.log(res);
    return res;
  }
}
