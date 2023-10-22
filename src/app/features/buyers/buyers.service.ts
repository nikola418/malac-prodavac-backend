import { Injectable } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Buyer, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.BuyerInclude = {
    user: true,
  };

  static readonly queryWhere: Prisma.BuyerWhereInput = {
    user: { roles: { has: UserRole.Buyer } },
  };

  create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.buyer.create({
      data: {
        user: {
          create: {
            ...createBuyerDto.user,
            password: hashPassword(createBuyerDto.user.password),
          },
        },
      },
      include: BuyersService.queryInclude,
    });
  }

  async findAll(findOptions: Prisma.BuyerFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Buyer, Prisma.BuyerFindManyArgs>(
      this.prisma.buyer,
      {
        ...findOptions,
        include: BuyersService.queryInclude,
      },
      { page },
    );
  }

  findOne({ id }: Prisma.BuyerWhereUniqueInput) {
    return this.prisma.buyer.findFirstOrThrow({
      where: { id },
      include: BuyersService.queryInclude,
    });
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return this.prisma.buyer.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateBuyerDto.user,
            password:
              updateBuyerDto.user?.password &&
              hashPassword(updateBuyerDto.user.password),
          },
        },
      },
      include: BuyersService.queryInclude,
    });
  }

  remove(id: number) {
    return this.prisma.user.deleteMany({ where: { buyer: { id } } });
  }
}
