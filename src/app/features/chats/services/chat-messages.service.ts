import { Inject, Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from '../dto';
import { Prisma, UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ChatMessagesService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ChatMessageInclude = { chat: true };

  async create(
    createChatMessageDto: CreateChatMessageDto,
    user: JWTPayloadUser,
  ) {
    if (user.roles.includes(UserRole.Customer))
      this.prisma.client.order.findFirstOrThrow({
        where: { customerId: user.customer?.id },
      });

    if (user.roles.includes(UserRole.Shop))
      this.prisma.client.chat.findFirstOrThrow({
        where: {
          shopId: user.shop?.id,
          customer: { userId: createChatMessageDto.toUserId },
        },
      });

    const toUser = this.prisma.client.user.findUniqueOrThrow({
      where: { id: createChatMessageDto.toUserId },
      include: { customer: true, shop: true },
    });

    const message = this.prisma.client.chatMessage.create({
      data: {
        text: createChatMessageDto.message.text,
        recipientUserId: createChatMessageDto.toUserId,
        chat: {
          connectOrCreate: {
            create: {
              customerId: user.customer?.id ?? (await toUser).customer?.id,
              shopId: user.shop?.id ?? (await toUser).shop?.id,
            },
            where: {
              customerId_shopId: {
                customerId: user.customer?.id ?? (await toUser).customer?.id,
                shopId: user.shop?.id ?? (await toUser).shop?.id,
              },
            },
          },
        },
      },
      include: ChatMessagesService.include,
    });

    return this.prisma.client.$transaction([toUser, message]);
  }

  findAll(
    chatId: number,
    args: Prisma.ChatMessageFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.chatMessage.paginate({
      where: { ...args.where, chatId },
      orderBy: args.orderBy,
      include: args.include ?? ChatMessagesService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.ChatMessageWhereUniqueInput,
    include?: Prisma.ChatMessageInclude,
  ) {
    return this.prisma.client.chatMessage.findUniqueOrThrow({
      where,
      include: include ?? ChatMessagesService.include,
    });
  }
}
