import { CustomPrismaService } from 'nestjs-prisma';
import { OrdersService } from '../../orders/services';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cursors, pageAndLimit } from '../../../../util/helper';

export class CustomerOrdersService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.OrderInclude = { ...OrdersService.include };

  findAll(
    args: Prisma.OrderFindManyArgs,
    cursors: Cursors,
    customerId: number,
  ) {
    const { page, limit } = pageAndLimit(args);
    const query = this.prisma.client.order.paginate({
      where: { ...args.where, customerId },
      orderBy: args.orderBy,
      include: CustomerOrdersService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(where: Prisma.OrderWhereUniqueInput, include?: Prisma.OrderInclude) {
    return this.prisma.client.order.findUniqueOrThrow({
      where,
      include: include ?? CustomerOrdersService.include,
    });
  }
}
