import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { OrderStatus, Prisma, UserRole } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../core/prisma';
import { Cursors, pageAndLimit } from '../../../util/helper';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.OrderInclude = {
    orderProducts: { include: { product: true } },
    customer: true,
    courier: true,
  };

  create(
    { deliveryMethod, products, timeOfSelfPickup }: CreateOrderDto,
    user: JWTPayloadUser,
  ) {
    return this.prisma.client.order.create({
      data: {
        orderProducts: {
          createMany: {
            data: products.map((product) => ({
              quantity: product.quantity,
              productId: product.productId,
            })),
          },
        },
        timeOfSelfPickup,
        deliveryMethod,
        customerId: user.customer?.id,
      },
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
          //*    query orders depending on user role
          { customerId: user.customer?.id },
          { orderProducts: { some: { product: { shopId: user.shop?.id } } } },
          {
            accepted: user.roles.includes(UserRole.Courier) && true,
          },
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

  update(id: number, updateOrderDto: UpdateOrderDto, user: JWTPayloadUser) {
    if (
      user.roles.includes(UserRole.Shop) &&
      updateOrderDto.orderStatus != OrderStatus.Packaged
    )
      throw new BadRequestException(
        'Can only change order status to Packaged!',
      );
    if (
      user.roles.includes(UserRole.Courier) &&
      updateOrderDto.orderStatus != OrderStatus.InDelivery
    )
      throw new BadRequestException(
        'Can only change order status to In Delivery!',
      );
    if (
      user.roles.includes(UserRole.Customer) &&
      updateOrderDto.orderStatus != OrderStatus.Received
    )
      throw new BadRequestException(
        'Can only change order status to Received!',
      );

    return this.prisma.client.order.update({
      where: { id },
      data: { ...updateOrderDto },
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
