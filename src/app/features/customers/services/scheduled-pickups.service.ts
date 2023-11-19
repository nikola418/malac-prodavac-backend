import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ScheduledPickupsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ScheduledPickupInclude = {};

  findAll(
    args: Prisma.ScheduledPickupFindManyArgs,
    cursors: Cursors,
    customerId: number,
  ) {
    const { page, limit } = pageAndLimit(args);
    const query = this.prisma.client.scheduledPickup.paginate({
      where: {
        ...args.where,
        order: { customerId },
      },
      orderBy: args.orderBy,
      include: args.include ?? ScheduledPickupsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.ScheduledPickupWhereUniqueInput,
    include?: Prisma.ScheduledPickupInclude,
  ) {
    return this.prisma.client.scheduledPickup.findUniqueOrThrow({
      where,
      include: include ?? ScheduledPickupsService.include,
    });
  }
}
