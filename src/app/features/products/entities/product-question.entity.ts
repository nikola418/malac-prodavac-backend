import { ProductQuestion } from '@prisma/client';
import { Type } from 'class-transformer';
import { ProductEntity } from './product.entity';
import { CustomerEntity } from '../../customers/entities';
import { ProductQuestionAnswerEntity } from './product-question-answer.entity';

export class ProductQuestionEntity implements ProductQuestion {
  constructor(partial: Partial<ProductQuestionEntity>) {
    Object.assign(this, partial);
  }

  productId: number;
  customerId: number;
  text: string;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductEntity)
  product?: ProductEntity;

  @Type(() => CustomerEntity)
  customer?: CustomerEntity;

  @Type(() => ProductQuestionAnswerEntity)
  productQuestionAnswers?: ProductQuestionAnswerEntity[];
}
