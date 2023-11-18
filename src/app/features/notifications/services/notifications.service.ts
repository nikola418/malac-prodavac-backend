import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Cursors, pageAndLimit } from '../../../../util/helper';
import { Prisma } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => ExtendedPrismaClientKey))
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.NotificationInclude = {
    notificationPayload: true,
  };

  create(userId: number, notification: MessageEvent) {
    return this.prisma.client.notification.create({
      data: {
        user: { connect: { id: userId } },
        notificationPayload: { create: { payload: notification } },
      },
    });
  }

  findAll(
    args: Prisma.NotificationFindManyArgs,
    cursors: Cursors,
    user: JWTPayloadUser,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.notification.paginate({
      where: { ...args.where, userId: user.id },
      orderBy: args.orderBy,
      include: args.include ?? NotificationsService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.NotificationWhereUniqueInput,
    include?: Prisma.NotificationInclude,
  ) {
    return this.prisma.client.notification.findUniqueOrThrow({
      where,
      include: include ?? NotificationsService.include,
    });
  }
}
