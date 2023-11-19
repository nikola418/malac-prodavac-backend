import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScheduledPickupsService } from '../services';
import { CreateScheduledPickupDto, UpdateScheduledPickupDto } from '../dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { OrderEntity, ScheduledPickupEntity } from '../entities';
import { OrdersHook, ScheduledPickupsHook } from '../hooks';

@ApiTags('orders')
@UseGuards(AccessGuard)
@Controller('orders/:id/scheduledPickups')
export class ScheduledPickupsController {
  constructor(private scheduledPickupsService: ScheduledPickupsService) {}

  @Post()
  @UseAbility(Actions.aggregate, OrderEntity, OrdersHook)
  @UseAbility(Actions.create, ScheduledPickupEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() createScheduledPickupDto: CreateScheduledPickupDto,
  ) {
    return new ScheduledPickupEntity(
      await this.scheduledPickupsService.create(
        orderId,
        createScheduledPickupDto,
      ),
    );
  }

  @Patch(':scheduledPickupId')
  @UseAbility(Actions.update, ScheduledPickupEntity, ScheduledPickupsHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) orderId: number,
    @Param('scheduledPickupId', ParseIntPipe) scheduledPickupId: number,
    @Body() updateScheduledPickupDto: UpdateScheduledPickupDto,
  ) {
    return new ScheduledPickupEntity(
      await this.scheduledPickupsService.update(
        orderId,
        scheduledPickupId,
        updateScheduledPickupDto,
      ),
    );
  }
}
