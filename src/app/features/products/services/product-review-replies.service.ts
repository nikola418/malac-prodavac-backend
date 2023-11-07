import { Inject, Injectable } from '@nestjs/common';
import { CreateProductReviewReplyDto } from '../dto';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ProductReviewRepliesService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ReviewReplyInclude = {};

  create(
    productId: number,
    id: number,
    createProductReviewReplyDto: CreateProductReviewReplyDto,
  ) {
    return this.prisma.client.reviewReply.create({
      data: {
        ...createProductReviewReplyDto,
        review: { connect: { productId, id } },
      },
      include: ProductReviewRepliesService.include,
    });
  }

  findAll(
    productId: number,
    reviewId: number,
    args: Prisma.ReviewReplyFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.reviewReply.paginate({
      where: { ...args.where, reviewId, review: { productId } },
      orderBy: args.orderBy,
      include: args.include ?? ProductReviewRepliesService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.ReviewReplyWhereUniqueInput,
    include?: Prisma.ReviewReplyInclude,
  ) {
    return this.prisma.client.reviewReply.findUniqueOrThrow({
      where,
      include: include ?? ProductReviewRepliesService.include,
    });
  }
}
