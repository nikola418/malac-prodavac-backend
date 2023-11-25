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
import { ScheduledPickupsService } from '../services';
import { CustomerEntity } from '../entities';
import { CustomersHook } from '../hooks';

@ApiTags('customers')
@UseGuards(AccessGuard)
@Controller('customers/:id/scheduledPickups')
export class ScheduledPickupsController {
  constructor(private scheduledPickupsService: ScheduledPickupsService) {}

  @Get()
  @UseAbility(Actions.read, CustomerEntity, CustomersHook)
  @UseAbility(Actions.read, ScheduledPickupEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ScheduledPickupWhereInput>(
        ['id', 'date', 'timeOfDay', 'orderId'],
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
        customerId,
      ),
    );
  }

  @Get(':scheduledPickupId')
  @UseAbility(Actions.read, ScheduledPickupEntity, ScheduledPickupsHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) customerId: number,
    @Param('scheduledPickupId', ParseIntPipe) scheduledPickupId: number,
  ) {
    return new ScheduledPickupEntity(
      await this.scheduledPickupsService.findOne({
        order: { customerId },
        id: scheduledPickupId,
      }),
    );
  }
}
