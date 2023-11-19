import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  UseGuards,
  Controller,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AccessGuard,
  Actions,
  CaslSubject,
  SubjectProxy,
  UseAbility,
} from 'nest-casl';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { Order, Prisma } from '@prisma/client';
import { OrderEntity } from '../../orders/entities';
import { serializePagination } from '../../../common/helpers';
import { afterAndBefore } from '../../../../util/helper';
import { CourierOrdersService } from '../services';
import { CourierEntity } from '../entities';
import { CourierOrdersHook, CouriersHook } from '../hooks';

@UseGuards(AccessGuard)
@ApiTags('couriers')
@Controller('courier/:id/orders')
export class CourierOrdersController {
  constructor(private courierOrdersService: CourierOrdersService) {}

  @Get()
  @UseAbility(Actions.aggregate, CourierEntity, CouriersHook)
  @UseAbility(Actions.read, OrderEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) courierId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>([], [...cursorQueries]),
    )
    filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    return serializePagination(
      OrderEntity,
      this.courierOrdersService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        courierId,
      ),
    );
  }

  @Get(':orderId')
  @UseAbility(Actions.read, OrderEntity, CourierOrdersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) courierId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @CaslSubject() orderProxy: SubjectProxy<Order>,
  ) {
    return new OrderEntity(await orderProxy.get());
  }
}
