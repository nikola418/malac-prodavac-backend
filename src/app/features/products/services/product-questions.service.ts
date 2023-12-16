import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { CustomersService } from '../../customers/services';
import { ProductQuestionEntity } from '../entities';
import { ProductsService } from './products.service';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { XOR } from '@nestjs/terminus/dist/utils';

@Injectable()
export class ProductQuestionsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ProductQuestionInclude = {
    customer: { include: CustomersService.include },
    product: { include: ProductsService.include },
    productQuestionAnswers: true,
  };

  async create(
    data: XOR<
      Prisma.ProductQuestionCreateInput,
      Prisma.ProductQuestionUncheckedCreateInput
    >,
  ): Promise<ProductQuestionEntity> {
    return this.prisma.client.productQuestion.create({
      data: data,
      include: ProductQuestionsService.include,
    });
  }

  async findAll(args: Prisma.ProductQuestionFindManyArgs, cursors: Cursors) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.productQuestion.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include ?? ProductQuestionsService.include,
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
              .concat(question.customerId.toString()),
          parseCursor: (cursor) => {
            const [productId, customerId] = cursor
              .split(',')
              .map((it) => Number(it));

            return { productId_customerId: { productId, customerId } };
          },
        });
  }

  async findOne(
    where: Prisma.ProductQuestionWhereUniqueInput,
    include?: Prisma.ProductQuestionInclude,
  ): Promise<ProductQuestionEntity> {
    return this.prisma.client.productQuestion.findUniqueOrThrow({
      where,
      include: include ?? ProductQuestionsService.include,
    });
  }
}
