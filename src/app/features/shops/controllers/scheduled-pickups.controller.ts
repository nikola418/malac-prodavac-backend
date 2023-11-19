import { DirectFilterPipe } from '@chax-at/prisma-filter';
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
import { ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { UseAbility, Actions, AccessGuard } from 'nest-casl';
import { afterAndBefore } from '../../../../util/helper';
import { serializePagination } from '../../../common/helpers';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';
import { ScheduledPickupEntity } from '../../orders/entities';
import { ScheduledPickupsHook } from '../../orders/hooks';
import { ShopEntity } from '../entities';
import { ShopsHook } from '../hooks/shops.hook';
import { ScheduledPickupsService } from '../services';

@ApiTags('shops')
@UseGuards(AccessGuard)
@Controller('shops/:id/scheduledPickups')
export class ScheduledPickupsController {
  constructor(private scheduledPickupsService: ScheduledPickupsService) {}

  @Get()
  @UseAbility(Actions.aggregate, ShopEntity, ShopsHook)
  @UseAbility(Actions.read, ScheduledPickupEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) shopId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ScheduledPickupWhereInput>(
        ['id', 'day', 'timeOfDay', 'orderId'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ScheduledPickupWhereInput>,
  ) {
    return serializePagination(
      ScheduledPickupEntity,
      this.scheduledPickupsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        shopId,
      ),
    );
  }

  @Get(':scheduledPickupId')
  @UseAbility(Actions.read, ScheduledPickupEntity, ScheduledPickupsHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) shopId: number,
    @Param('scheduledPickupId', ParseIntPipe) scheduledPickupId: number,
  ) {
    return new ScheduledPickupEntity(
      await this.scheduledPickupsService.findOne({
        order: { product: { shopId } },
        id: scheduledPickupId,
      }),
    );
  }
}
