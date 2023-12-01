import { Prisma } from '@prisma/client';
import { CreateProductReviewDto, UpdateProductReviewDto } from '../dto';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ProductReviewsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ReviewInclude = { reviewReplies: true };

  async create(
    productId: number,
    createProductReviewDto: CreateProductReviewDto,
    user: JWTPayloadUser,
  ) {
    const review = this.prisma.client.review.create({
      data: {
        ...createProductReviewDto,
        productId,
        customerId: user.customer?.id,
      },
      include: ProductReviewsService.include,
    });

    const product = this.prisma.client.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const updateProduct = this.prisma.client.product.update({
      where: { id: productId },
      data: {
        rating: (await product).rating
          .times((await product).ratingsCount)
          .add(createProductReviewDto.rating)
          .div((await product).ratingsCount + 1),
        ratingsCount: { increment: 1 },
      },
    });

    const [res] = await this.prisma.client.$transaction([
      review,
      product,
      updateProduct,
    ]);
    return res;
  }

  findAll(
    productId: number,
    args: Prisma.ReviewFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.review.paginate({
      where: { ...args.where, productId },
      orderBy: args.orderBy,
      include: args.include ?? ProductReviewsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.ReviewWhereUniqueInput,
    include?: Prisma.ReviewInclude,
  ) {
    return this.prisma.client.review.findUniqueOrThrow({
      where,
      include: include ?? ProductReviewsService.include,
    });
  }

  async update(
    productId: number,
    id: number,
    updateProductReviewDto: UpdateProductReviewDto,
  ) {
    const oldReview = this.prisma.client.review.findUniqueOrThrow({
      where: { productId, id },
    });

    const review = this.prisma.client.review.update({
      where: { productId, id },
      data: { ...updateProductReviewDto },
      include: ProductReviewsService.include,
    });

    const product = this.prisma.client.product.findUniqueOrThrow({
      where: { id: productId },
    });

    const updateProduct = this.prisma.client.product.update({
      where: { id: productId },
      data: {
        rating: (await product).rating
          .times((await product).ratingsCount)
          .add(updateProductReviewDto.rating - (await oldReview).rating)
          .div((await product).ratingsCount),
      },
    });

    const res = await this.prisma.client.$transaction([
      oldReview,
      review,
      product,
      updateProduct,
    ]);

    return res[1];
  }
}
