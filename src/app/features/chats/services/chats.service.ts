/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Chat, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ChatInclude = {
    customer: true,
    shop: true,
    chatMessages: { orderBy: { createdAt: 'desc' }, take: 1 },
    _count: { select: { chatMessages: { where: { opened: false } } } },
  };

  findAll(findOptions: Prisma.ChatFindManyArgs, user: JWTPayloadUser) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Chat, Prisma.ChatFindManyArgs>(
      this.prisma.chat,
      {
        ...findOptions,
        where: {
          ...findOptions.where,
          shopId: user.shop?.id,
          customerId: user.customer?.id,
        },
        include: ChatsService.include,
      },
      { page },
    );
  }

  findOne(where: Prisma.ChatWhereUniqueInput, include?: Prisma.ChatInclude) {
    return this.prisma.chat.findUniqueOrThrow({
      where,
      include: include ?? ChatsService.include,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
