import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Prisma } from '@prisma/client';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { CreateFavoriteProductDto } from '../dto';

@Injectable()
export class FavoriteProductsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.FavoriteProductInclude = { product: true };

  create(customerId: number, { productId }: CreateFavoriteProductDto) {
    return this.prisma.client.favoriteProduct.create({
      data: { productId, customerId },
      include: FavoriteProductsService.include,
    });
  }

  findAll(
    args: Prisma.FavoriteProductFindManyArgs,
    cursors: Cursors,
    customerId: number,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.favoriteProduct.paginate({
      where: { ...args.where, customerId },
      orderBy: args.orderBy,
      include: args.include ?? FavoriteProductsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.FavoriteProductWhereUniqueInput,
    include?: Prisma.FavoriteProductInclude,
  ) {
    return this.prisma.client.favoriteProduct.findUniqueOrThrow({
      where,
      include: include ?? FavoriteProductsService.include,
    });
  }

  remove(customerId: number, id: number) {
    return this.prisma.client.favoriteProduct.delete({
      where: { customerId, id },
      include: FavoriteProductsService.include,
    });
  }
}
