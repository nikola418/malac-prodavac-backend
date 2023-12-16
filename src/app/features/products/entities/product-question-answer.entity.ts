import { ProductQuestionAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import { ShopEntity } from '../../shops/entities';
import { ProductQuestionEntity } from './';

export class ProductQuestionAnswerEntity implements ProductQuestionAnswer {
  constructor(partial: Partial<ProductQuestionAnswerEntity>) {
    Object.assign(this, partial);
  }

  productId: number;
  customerId: number;
  shopId: number;
  text: string;
  updatedAt: Date;
  createdAt: Date;

  @Type(() => ProductQuestionEntity)
  productQuestion?: ProductQuestionEntity;

  @Type(() => ShopEntity)
  shop?: ShopEntity;
}
