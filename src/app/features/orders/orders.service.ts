import { Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { PrismaService } from 'nestjs-prisma';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { Order, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.OrderInclude = {
    product: true,
    customer: true,
    courier: true,
  };

  create(createOrderDto: CreateOrderDto, user: JWTPayloadUser) {
    return this.prisma.order.create({
      data: { ...createOrderDto, customerId: user.customer?.id },
      include: OrdersService.include,
    });
  }

  findAll(findOptions: Prisma.OrderFindManyArgs, user: JWTPayloadUser) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Order, Prisma.OrderFindManyArgs>(
      this.prisma.order,
      {
        ...findOptions,
        where: {
          ...findOptions.where,
          OR: [
            //*    query orders depending on user role
            { customerId: user.customer?.id },
            { product: { shopId: user.shop?.id } },
          ],
        },
        include: OrdersService.include,
      },
      { page },
    );
  }

  findOne(where: Prisma.OrderWhereUniqueInput, include?: Prisma.OrderInclude) {
    return this.prisma.order.findUniqueOrThrow({
      where,
      include: include ?? OrdersService.include,
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: { ...updateOrderDto },
      include: OrdersService.include,
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
      include: OrdersService.include,
    });
  }
}
