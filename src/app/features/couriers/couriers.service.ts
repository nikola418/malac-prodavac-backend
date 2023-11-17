import { Inject, Injectable } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { Prisma, UserRole } from '@prisma/client';
import { Cursors, hashPassword, pageAndLimit } from '../../../util/helper';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../core/prisma';

@Injectable()
export class CouriersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.CourierInclude = { user: true };

  create(createCourierDto: CreateCourierDto) {
    return this.prisma.client.courier.create({
      data: {
        user: {
          create: {
            ...createCourierDto.user,
            password: hashPassword(createCourierDto.user.password),
            roles: { set: [UserRole.Courier, UserRole.Customer] },
            customer: { create: {} },
          },
        },
      },
      include: CouriersService.include,
    });
  }

  async findAll(args: Prisma.CourierFindManyArgs, cursors: Cursors) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.courier.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include ?? CouriersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.CourierWhereUniqueInput,
    include?: Prisma.CourierInclude,
  ) {
    return this.prisma.client.courier.findUniqueOrThrow({
      where,
      include: include ?? CouriersService.include,
    });
  }

  update(id: number, updateCourierDto: UpdateCourierDto) {
    return this.prisma.client.courier.update({
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
      include: CouriersService.include,
    });
  }
}
