import { Injectable } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { PrismaService } from 'nestjs-prisma';
import { Courier, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class CouriersService {
  constructor(private prisma: PrismaService) {}

  static readonly queryInclude: Prisma.CourierInclude = { user: true };

  create(createCourierDto: CreateCourierDto) {
    return this.prisma.courier.create({
      data: {
        pricePerKilometer: createCourierDto.pricePerKilometer,
        user: {
          create: {
            ...createCourierDto.user,
            password: hashPassword(createCourierDto.user.password),
            roles: { set: [UserRole.Courier] },
          },
        },
      },
      include: CouriersService.queryInclude,
    });
  }

  async findAll(findOptions: Prisma.CourierFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Courier, Prisma.CourierFindManyArgs>(
      this.prisma.courier,
      {
        ...findOptions,
        include: CouriersService.queryInclude,
      },
      { page },
    );
  }

  findOne({ id }: Prisma.CourierWhereInput) {
    return this.prisma.courier.findFirstOrThrow({
      where: { id },
      include: CouriersService.queryInclude,
    });
  }

  update(id: number, updateCourierDto: UpdateCourierDto) {
    return this.prisma.courier.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateCourierDto.user,
            password:
              updateCourierDto.user?.password &&
              hashPassword(updateCourierDto.user.password),
          },
        },
      },
      include: CouriersService.queryInclude,
    });
  }

  async remove(id: number) {
    const res = await this.prisma.user.deleteMany({
      where: { courier: { id } },
    });
    console.log(res);
    return res;
  }
}
