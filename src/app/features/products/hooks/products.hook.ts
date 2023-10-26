import { SubjectBeforeFilterHook } from 'nest-casl';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ProductEntity } from '../entities/product.entity';
import { ProductsService } from '../services/products.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsHook
  implements SubjectBeforeFilterHook<ProductEntity, AuthorizableRequest>
{
  constructor(private productsService: ProductsService) {}

  run({ params }: AuthorizableRequest) {
    return this.productsService.findOne(
      { id: +params.id },
      { _count: { select: { productMedias: true } } },
    );
  }
}
