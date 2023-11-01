import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { CreateChatMessageDto } from './dto';
import { Server } from 'socket.io';
import {
  prismaKnownClientExceptionMappings,
  validationPipeOptions,
} from '../../../util/definition';
import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { ChatMessageEntity } from './entities';
import { ResponseSerializerInterceptor } from '../../common/interceptors';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ChatMessagesService } from './services';
import { AuthorizableSocket } from '../../core/socket.io';
import { plainToInstance } from 'class-transformer';

@UseFilters(new WsExceptionFilter(prismaKnownClientExceptionMappings))
@UseGuards(AccessGuard)
@UseInterceptors(ResponseSerializerInterceptor)
@UsePipes(new ValidationPipe(validationPipeOptions))
@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @SubscribeMessage('new-message')
  @UseAbility(Actions.create, ChatMessageEntity)
  async create(
    @ConnectedSocket()
    client: AuthorizableSocket,
    @MessageBody() createChatMessageDto: CreateChatMessageDto,
  ): Promise<WsResponse<ChatMessageEntity>> {
    const message = await this.chatMessagesService.create(
      createChatMessageDto,
      client.user,
    );
    client
      .to(message.recipientId.toString())
      .emit('new-message', plainToInstance(ChatMessageEntity, message));
    return { event: 'new-message', data: new ChatMessageEntity(message) };
  }
}
