import { Inject, Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Currency, Prisma, UserRole } from '@prisma/client';
import { Cursors, hashPassword, pageAndLimit } from '../../../util/helper';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../core/prisma';

@Injectable()
export class ShopsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ShopInclude = {
    user: true,
    _count: { select: { products: true } },
  };

  create(createShopDto: CreateShopDto) {
    return this.prisma.client.shop.create({
      data: {
        user: {
          create: {
            ...createShopDto.user,
            password: hashPassword(createShopDto.user.password),
            roles: {
              set: [UserRole.Shop, UserRole.Courier, UserRole.Customer],
            },
            customer: { create: {} },
            courier: { create: {} },
          },
        },
      },
      include: ShopsService.include,
    });
  }

  findAll(args: Prisma.ShopFindManyArgs, cursors: Cursors) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.shop.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include ?? ShopsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(where: Prisma.ShopWhereUniqueInput, include?: Prisma.ShopInclude) {
    return this.prisma.client.shop.findUniqueOrThrow({
      where,
      include: include ?? ShopsService.include,
    });
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.prisma.client.shop.update({
      where: { id },
      data: {
        user: {
          update: {
            currency: Currency.RSD,
            ...updateShopDto.user,
            password:
              updateShopDto.user?.password &&
              hashPassword(updateShopDto.user.password),
          },
        },
      },
      include: ShopsService.include,
    });
  }
}
