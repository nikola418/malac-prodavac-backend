import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderStatus, Prisma } from '@prisma/client';
import { AccessGuard, AccessService, Actions, UseAbility } from 'nest-casl';
import { afterAndBefore } from '../../../../util/helper';
import { AuthUser } from '../../../common/decorators';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { ProductEntity } from '../../products/entities';
import { ProductsService } from '../../products/services';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { OrderEntity } from '../entities';
import { OrdersHook } from '../hooks';
import { OrdersService } from '../services';

@UseGuards(AccessGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private accessService: AccessService,
  ) {}

  @Post()
  @UseAbility<ProductEntity>(Actions.aggregate, ProductEntity, [
    ProductsService,
    (service: ProductsService, { body }) =>
      service.findOne({ id: body.productId }),
  ])
  @UseAbility(Actions.create, OrderEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new OrderEntity(
      await this.ordersService.create(createOrderDto, user),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, OrderEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.OrderWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      OrderEntity,
      this.ordersService.findAll(
        filterDto.findOptions,
        user,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new OrderEntity(await this.ordersService.findOne({ id }));
  }

  @ApiOperation({
    description: `The shop must first accept the order to have permissions to set courierId and orderStatus.<br/> The shop can set accepted to false only if orderStatus is ${OrderStatus.Ordered}`,
  })
  @Patch(':id')
  @UseAbility(Actions.update, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return new OrderEntity(await this.ordersService.update(id, updateOrderDto));
  }

  @Delete(':id')
  @UseAbility(Actions.delete, OrderEntity, OrdersHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new OrderEntity(await this.ordersService.remove(id));
  }
}
