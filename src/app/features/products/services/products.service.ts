import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ProductInclude = {
    category: true,
    discounts: true,
    shop: true,
    reviews: true,
  };

  create(createProductDto: CreateProductDto, user: JWTPayloadUser) {
    return this.prisma.client.product.create({
      data: { ...createProductDto, shopId: user.shop?.id },
      include: ProductsService.include,
    });
  }

  findAll(args: Prisma.ProductFindManyArgs, cursors: Cursors) {
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

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
        });
  }

  findOne(
    where: Prisma.ProductWhereUniqueInput,
    include?: Prisma.ProductInclude,
  ) {
    return this.prisma.client.product.findUniqueOrThrow({
      where,
      include: include ?? ProductsService.include,
    });
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
