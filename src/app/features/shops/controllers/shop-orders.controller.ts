import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  UseGuards,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Prisma, Order } from '@prisma/client';
import {
  AccessGuard,
  UseAbility,
  Actions,
  CaslSubject,
  SubjectProxy,
} from 'nest-casl';
import { afterAndBefore } from '../../../../util/helper';
import { serializePagination } from '../../../common/helpers';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';
import { OrderEntity } from '../../orders/entities';
import { ShopOrdersService } from '../services';
import { ShopOrdersHook, ShopsHook } from '../hooks';
import { ShopEntity } from '../entities';

@UseGuards(AccessGuard)
@ApiTags('shops')
@Controller('shops/:id/orders')
export class ShopOrdersController {
  constructor(private shopOrdersService: ShopOrdersService) {}

  @Get()
  @UseAbility(Actions.aggregate, ShopEntity, ShopsHook)
  @UseAbility(Actions.read, OrderEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) shopId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>([], [...cursorQueries]),
    )
    filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    return serializePagination(
      OrderEntity,
      this.shopOrdersService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        shopId,
      ),
    );
  }

  @Get(':orderId')
  @UseAbility(Actions.read, OrderEntity, ShopOrdersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) shopId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @CaslSubject() orderProxy: SubjectProxy<Order>,
  ) {
    return new OrderEntity(await orderProxy.get());
  }
}
