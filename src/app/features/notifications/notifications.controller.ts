import {
  Controller,
  Sse,
  MessageEvent,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { NotificationSubjectsService, NotificationsService } from './services';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuthUser } from '../../common/decorators';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto, cursorQueries } from '../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { PaginationResponse, serializePagination } from '../../common/helpers';
import { NotificationEntity } from './entities';
import { afterAndBefore } from '../../../util/helper';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { NotificationsHook } from './notifications.hook';

@UseGuards(AccessGuard)
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationSubjectsService: NotificationSubjectsService,
    private notificationsService: NotificationsService,
  ) {}

  @Sse('subscribe')
  @UseAbility(Actions.read, NotificationEntity)
  subscribe(@AuthUser() user: JWTPayloadUser): Observable<MessageEvent> {
    return this.notificationSubjectsService.subscribe(user);
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, NotificationEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.NotificationWhereInput>(
        ['id', 'userId'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.NotificationWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      NotificationEntity,
      this.notificationsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, NotificationEntity, NotificationsHook)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findOne({ id });
  }
}
