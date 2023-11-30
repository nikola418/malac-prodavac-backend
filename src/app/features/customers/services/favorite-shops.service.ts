import { Inject, Injectable } from '@nestjs/common';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Prisma } from '@prisma/client';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { CustomPrismaService } from 'nestjs-prisma';
import { CreateFavoriteShopDto } from '../dto';
import { ShopsService } from '../../shops/services';

@Injectable()
export class FavoriteShopsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.FavoriteShopInclude = {
    shop: { include: ShopsService.include },
  };

  create(customerId: number, { shopId }: CreateFavoriteShopDto) {
    return this.prisma.client.favoriteShop.create({
      data: { customerId, shopId },
      include: FavoriteShopsService.include,
    });
  }

  findAll(
    args: Prisma.FavoriteShopFindManyArgs,
    cursors: Cursors,
    customerId: number,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.favoriteShop.paginate({
      where: { ...args.where, customerId },
      orderBy: args.orderBy,
      include: args.include ?? FavoriteShopsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.FavoriteShopWhereUniqueInput,
    include?: Prisma.FavoriteShopInclude,
  ) {
    return this.prisma.client.favoriteShop.findUniqueOrThrow({
      where,
      include: include ?? FavoriteShopsService.include,
    });
  }

  remove(customerId: number, id: number) {
    return this.prisma.client.favoriteShop.delete({
      where: { customerId, id },
      include: FavoriteShopsService.include,
    });
  }
}
