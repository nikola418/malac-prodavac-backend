import { Prisma, Review } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateProductReviewDto } from '../dto';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { Injectable } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ProductReviewsService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ReviewInclude = { reviewReplies: true };

  create(
    productId: number,
    createProductReviewDto: CreateProductReviewDto,
    user: JWTPayloadUser,
  ) {
    return this.prisma.review.create({
      data: {
        ...createProductReviewDto,
        productId,
        customerId: user.customer?.id,
      },
      include: ProductReviewsService.include,
    });
  }

  findAll(productId: number, findOptions: Prisma.ReviewFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Review, Prisma.ReviewFindManyArgs>(
      this.prisma.review,
      {
        ...findOptions,
        where: { ...findOptions.where, productId },
        include: ProductReviewsService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ReviewWhereUniqueInput,
    include?: Prisma.ReviewInclude,
  ) {
    return this.prisma.review.findUniqueOrThrow({
      where,
      include: include ?? ProductReviewsService.include,
    });
  }
}
