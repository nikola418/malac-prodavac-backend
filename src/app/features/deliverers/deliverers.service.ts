import { Injectable } from '@nestjs/common';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { UpdateDelivererDto } from './dto/update-deliverer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Deliverer, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class DeliverersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.DelivererInclude = { user: true };

  create(createDelivererDto: CreateDelivererDto) {
    return this.prisma.deliverer.create({
      data: {
        pricePerKilometer: createDelivererDto.pricePerKilometer,
        user: {
          create: {
            ...createDelivererDto.user,
            password: hashPassword(createDelivererDto.user.password),
            roles: { set: [UserRole.Deliverer] },
          },
        },
      },
      include: DeliverersService.queryInclude,
    });
  }

  async findAll(findOptions: Prisma.DelivererFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Deliverer, Prisma.DelivererFindManyArgs>(
      this.prisma.deliverer,
      {
        ...findOptions,
        include: DeliverersService.queryInclude,
      },
      { page },
    );
  }

  findOne({ id }: Prisma.DelivererWhereInput) {
    return this.prisma.deliverer.findFirstOrThrow({
      where: { id },
      include: DeliverersService.queryInclude,
    });
  }

  update(id: number, updateDelivererDto: UpdateDelivererDto) {
    return this.prisma.deliverer.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateDelivererDto.user,
            password:
              updateDelivererDto.user?.password &&
              hashPassword(updateDelivererDto.user.password),
          },
        },
      },
      include: DeliverersService.queryInclude,
    });
  }

  async remove(id: number) {
    const res = await this.prisma.user.deleteMany({
      where: { deliverer: { id } },
    });
    console.log(res);
    return res;
  }
}
