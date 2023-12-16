import { Inject, Injectable } from '@nestjs/common';
import { XOR } from '@nestjs/terminus/dist/utils';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { ShopsService } from '../../shops/services';
import { ProductQuestionAnswerEntity } from '../entities';
import { ProductQuestionsService } from './product-questions.service';

@Injectable()
export class ProductQuestionAnswersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ProductQuestionAnswerInclude = {
    productQuestion: { include: ProductQuestionsService.include },
    shop: { include: ShopsService.include },
  };

  async create(
    data: XOR<
      Prisma.ProductQuestionAnswerCreateInput,
      Prisma.ProductQuestionAnswerUncheckedCreateInput
    >,
  ): Promise<ProductQuestionAnswerEntity> {
    return this.prisma.client.productQuestionAnswer.create({
      data: data,
      include: ProductQuestionAnswersService.include,
    });
  }

  async findAll(
    args: Prisma.ProductQuestionAnswerFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.productQuestionAnswer.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include ?? ProductQuestionAnswersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
          getCursor: (question) =>
            question.productId
              .toString()
              .concat(',')
              .concat(question.customerId.toString())
              .concat(',')
              .concat(question.shopId.toString()),
          parseCursor: (cursor) => {
            const [productId, customerId, shopId] = cursor
              .split(',')
              .map((it) => Number(it));

            return {
              productId_customerId_shopId: { productId, customerId, shopId },
            };
          },
        });
  }

  async findOne(
    where: Prisma.ProductQuestionAnswerWhereUniqueInput,
    include?: Prisma.ProductQuestionAnswerInclude,
  ): Promise<ProductQuestionAnswerEntity> {
    return this.prisma.client.productQuestionAnswer.findUniqueOrThrow({
      where,
      include: include ?? ProductQuestionAnswersService.include,
    });
  }
}
