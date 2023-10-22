import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Prisma, Seller, UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.SellerInclude = {
    user: true,
    products: true,
  };

  create(createSellerDto: CreateSellerDto) {
    return this.prisma.seller.create({
      data: {
        user: {
          create: {
            ...createSellerDto.user,
            password: hashPassword(createSellerDto.user.password),
            roles: { set: [UserRole.Seller] },
          },
        },
      },
      include: SellersService.queryInclude,
    });
  }

  findAll(findOptions: Prisma.SellerFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Seller, Prisma.SellerFindManyArgs>(
      this.prisma.seller,
      {
        ...findOptions,
        include: SellersService.queryInclude,
      },
      { page },
    );
  }

  findOne({ id }: Prisma.SellerWhereInput) {
    return this.prisma.seller.findFirstOrThrow({
      where: { id },
      include: SellersService.queryInclude,
    });
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return this.prisma.seller.update({
      where: { id },
      data: {
        user: {
          update: {
            currency: 'RSD',
            ...updateSellerDto.user,
            password:
              updateSellerDto.user?.password &&
              hashPassword(updateSellerDto.user.password),
          },
        },
      },
      include: SellersService.queryInclude,
    });
  }

  remove(id: number) {
    return this.prisma.seller.delete({
      where: { id },
      include: SellersService.queryInclude,
    });
  }
}
