import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { ChatEntity, ChatMessageEntity } from '../entities';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ChatMessagesService } from '../services';
import { ChatsHook } from '../hooks';
import { afterAndBefore } from '../../../../util/helper';

@UseGuards(AccessGuard)
@ApiTags('chats')
@Controller('chats/:id/messages')
export class ChatMessagesController {
  constructor(private chatMessagesService: ChatMessagesService) {}

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, ChatEntity, ChatsHook)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) chatId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ChatMessageWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ChatMessageWhereInput>,
  ) {
    return serializePagination(
      ChatMessageEntity,
      this.chatMessagesService.findAll(
        chatId,
        filterDto.findOptions,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':messageId')
  @UseAbility(Actions.read, ChatEntity, ChatsHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) chatId: number,
    @Param('messageId', ParseIntPipe) id: number,
  ) {
    return new ChatEntity(
      await this.chatMessagesService.findOne({ chatId, id }),
    );
  }
}
