import { Inject, Injectable } from '@nestjs/common';
import { CreateShopDto } from '../dto/create-shop.dto';
import { UpdateShopDto } from '../dto/update-shop.dto';
import { Currency, Prisma, UserRole } from '@prisma/client';
import { Cursors, hashPassword, pageAndLimit } from '../../../../util/helper';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
  computeIsFavoredShop,
  computeIsFavoredShops,
} from '../../../core/prisma';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@Injectable()
export class ShopsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ShopInclude = {
    user: true,
    products: { take: 5 },
    _count: { select: { products: true, favoriteShops: true } },
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

  async findAll(
    args: Prisma.ShopFindManyArgs,
    cursors: Cursors,
    user: JWTPayloadUser,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.shop.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: {
        ...(args.include ?? ShopsService.include),
        favoriteShops: { where: { customerId: user.customer?.id } },
      },
    });

    const res = page
      ? await query.withPages({ page, limit })
      : await query.withCursor({ ...cursors, limit });

    res[0] = await computeIsFavoredShops(user, res[0]);
    return res;
  }

  async findOne(
    where: Prisma.ShopWhereUniqueInput,
    user?: JWTPayloadUser,
    include?: Prisma.ShopInclude,
  ) {
    const res = await this.prisma.client.shop.findUniqueOrThrow({
      where,
      include: {
        ...(include ?? ShopsService.include),
        favoriteShops: user
          ? { where: { customerId: user.customer?.id } }
          : undefined,
      },
    });

    if (!user) return res;
    return computeIsFavoredShop(user, res);
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.prisma.client.shop.update({
      where: { id },
      data: {
        businessName: updateShopDto.businessName,
        openFrom: updateShopDto.openFrom,
        openTill: updateShopDto.openTill,
        openFromDays: updateShopDto.openFromDays,
        openTillDays: updateShopDto.openTillDays,
        availableAt: updateShopDto.availableAt,
        availableAtLatitude: updateShopDto.availableAtLatitude,
        availableAtLongitude: updateShopDto.availableAtLongitude,
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
