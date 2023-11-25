import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { Prisma, UserRole } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.OrderInclude = {
    product: true,
    customer: true,
    courier: true,
  };

  create(createOrderDto: CreateOrderDto, user: JWTPayloadUser) {
    return this.prisma.client.order.create({
      data: { ...createOrderDto, customerId: user.customer?.id },
      include: OrdersService.include,
    });
  }

  findAll(
    args: Prisma.OrderFindManyArgs,
    user: JWTPayloadUser,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.order.paginate({
      where: {
        ...args.where,
        OR: [
          {
            customerId: user.customer?.id,
          },
          {
            product: { shopId: user.shop?.id },
          },
          user.roles.includes(UserRole.Courier)
            ? {
                accepted: true,
                courierId: user.courier?.id,
              }
            : {},
        ],
      },
      orderBy: args.orderBy,
      include: OrdersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(where: Prisma.OrderWhereUniqueInput, include?: Prisma.OrderInclude) {
    return this.prisma.client.order.findUniqueOrThrow({
      where,
      include: include ?? OrdersService.include,
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.client.order.update({
      where: { id },
      data: {
        ...updateOrderDto,
      },
      include: OrdersService.include,
    });
  }

  remove(id: number) {
    return this.prisma.client.order.delete({
      where: { id },
      include: OrdersService.include,
    });
  }
}
