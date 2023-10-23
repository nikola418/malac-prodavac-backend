import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Prisma, Shop, UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.ShopInclude = {
    user: true,
    products: true,
  };

  create(createShopDto: CreateShopDto) {
    return this.prisma.shop.create({
      data: {
        user: {
          create: {
            ...createShopDto.user,
            password: hashPassword(createShopDto.user.password),
            roles: { set: [UserRole.Shop] },
          },
        },
      },
      include: ShopsService.queryInclude,
    });
  }

  findAll(findOptions: Prisma.ShopFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Shop, Prisma.ShopFindManyArgs>(
      this.prisma.shop,
      {
        ...findOptions,
        include: ShopsService.queryInclude,
      },
      { page },
    );
  }

  findOne({ id }: Prisma.ShopWhereInput) {
    return this.prisma.shop.findFirstOrThrow({
      where: { id },
      include: ShopsService.queryInclude,
    });
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return this.prisma.shop.update({
      where: { id },
      data: {
        user: {
          update: {
            currency: 'RSD',
            ...updateShopDto.user,
            password:
              updateShopDto.user?.password &&
              hashPassword(updateShopDto.user.password),
          },
        },
      },
      include: ShopsService.queryInclude,
    });
  }

  async remove(id: number) {
    return this.prisma.user.deleteMany({ where: { shop: { id } } });
  }
}
