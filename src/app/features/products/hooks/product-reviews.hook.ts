import { SubjectBeforeFilterHook } from 'nest-casl';
import { AuthorizableRequest } from '../../../core/authentication/jwt';
import { ProductReviewEntity } from '../entities/product-review.entity';
import { ProductReviewsService } from '../services';

export class ProductReviewsHook
  implements SubjectBeforeFilterHook<ProductReviewEntity, AuthorizableRequest>
{
  constructor(private productReviewsService: ProductReviewsService) {}

  run({ params }: AuthorizableRequest) {
    return this.productReviewsService.findOne({ id: +params.id });
  }
}
