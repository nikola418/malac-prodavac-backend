import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ChatsService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ChatInclude = {
    customer: true,
    shop: true,
    chatMessages: { orderBy: { createdAt: 'desc' }, take: 1 },
  };

  findAll(
    args: Prisma.ChatFindManyArgs,
    user: JWTPayloadUser,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    args = {
      ...args,
    };

    const query = this.prisma.client.chat.paginate({
      where: {
        ...args.where,
        shopId: user.shop?.id,
        customerId: user.customer?.id,
      },
      orderBy: args.orderBy,
      include: {
        ...args.include,
        ...ChatsService.include,
        _count: {
          select: {
            chatMessages: {
              where: { recipientUserId: user.id, opened: false },
            },
          },
        },
      },
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(where: Prisma.ChatWhereUniqueInput, include?: Prisma.ChatInclude) {
    return this.prisma.client.chat.findUniqueOrThrow({
      where,
      include: include ?? ChatsService.include,
    });
  }

  openChat(where: Prisma.ChatWhereUniqueInput, recipientUserId: number) {
    return this.prisma.client.chat.update({
      data: {
        chatMessages: {
          updateMany: {
            data: { opened: true },
            where: { opened: false, recipientUserId },
          },
        },
      },
      where,
      include: ChatsService.include,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
