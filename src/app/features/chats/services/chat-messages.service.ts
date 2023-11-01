import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateChatMessageDto } from '../dto';
import { ChatMessage, Prisma, UserRole } from '@prisma/client';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class ChatMessagesService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.ChatMessageInclude = {};

  create(createChatMessageDto: CreateChatMessageDto, user: JWTPayloadUser) {
    const customerId = user.roles.includes(UserRole.Customer)
      ? user.customer?.id
      : createChatMessageDto.recipientId;
    const shopId = user.roles.includes(UserRole.Shop)
      ? user.shop?.id
      : createChatMessageDto.recipientId;

    return this.prisma.chatMessage.create({
      data: {
        ...createChatMessageDto,
        chat: {
          connectOrCreate: {
            create: {
              customerId,
              shopId,
            },
            where: {
              customerId_shopId: {
                customerId,
                shopId,
              },
            },
          },
        },
      },
      include: ChatMessagesService.include,
    });
  }

  findAll(chatId: number, findOptions: Prisma.ChatMessageFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<ChatMessage, Prisma.ChatMessageFindManyArgs>(
      this.prisma.chatMessage,
      {
        ...findOptions,
        where: { ...findOptions.where, chatId },
      },
      { page },
    );
  }

  findOne(
    where: Prisma.ChatMessageWhereUniqueInput,
    include?: Prisma.ChatMessageInclude,
  ) {
    return this.prisma.chatMessage.findUniqueOrThrow({
      where,
      include: include ?? ChatMessagesService.include,
    });
  }
}
