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
import { CustomerOrdersService } from '../services';
import { afterAndBefore } from '../../../../util/helper';
import { CustomerEntity } from '../entities';
import { CustomersHook } from '../hooks';
import { CustomerOrdersHook } from '../hooks/customer-orders.hook';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/orders')
export class CustomerOrdersController {
  constructor(private customerOrdersService: CustomerOrdersService) {}

  @Get()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.read, OrderEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>([], [...cursorQueries]),
    )
    filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    return serializePagination(
      OrderEntity,
      this.customerOrdersService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        customerId,
      ),
    );
  }

  @Get(':orderId')
  @UseAbility(Actions.read, OrderEntity, CustomerOrdersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) customerId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @CaslSubject() orderProxy: SubjectProxy<Order>,
  ) {
    return new OrderEntity(await orderProxy.get());
  }
}
