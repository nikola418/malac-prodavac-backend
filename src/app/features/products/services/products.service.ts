import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
  computeIsFavoredProduct,
  computeIsFavoredProducts,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { ProductReviewsService } from './product-reviews.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ProductInclude = {
    _count: {
      select: { favoriteProducts: true, productMedias: true, reviews: true },
    },
    category: true,
    discounts: true,
    shop: true,
    reviews: { include: ProductReviewsService.include },
  };

  create(createProductDto: CreateProductDto, user: JWTPayloadUser) {
    return this.prisma.client.product.create({
      data: { ...createProductDto, shopId: user.shop?.id },
      include: ProductsService.include,
    });
  }

  async findAll(
    args: Prisma.ProductFindManyArgs,
    cursors: Cursors,
    user: JWTPayloadUser,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.product.paginate({
      where: {
        ...args.where,
        category: {
          OR: args.where.category?.parentCategoryId
            ? [
                { id: args.where.category?.parentCategoryId },
                { parentCategoryId: args.where.category?.parentCategoryId },
              ]
            : undefined,
        },
      },
      orderBy: args.orderBy,
      include: args.include ?? ProductsService.include,
    });

    const res = page
      ? await query.withPages({ page, limit })
      : await query.withCursor({ ...cursors, limit });

    res[0] = await computeIsFavoredProducts(user, res[0]);
    return res;
  }

  async findOne(
    where: Prisma.ProductWhereUniqueInput,
    user?: JWTPayloadUser,
    include?: Prisma.ProductInclude,
  ) {
    const res = await this.prisma.client.product.findUniqueOrThrow({
      where,
      include: include ?? ProductsService.include,
    });

    if (!user) return res;

    return computeIsFavoredProduct(user, res);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.client.product.update({
      where: { id },
      data: { ...updateProductDto },
      include: ProductsService.include,
    });
  }

  remove(id: number) {
    return this.prisma.client.product.delete({
      where: { id },
      include: ProductsService.include,
    });
  }
}
