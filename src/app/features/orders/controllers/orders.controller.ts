import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from '../services';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard, AccessService, Actions, UseAbility } from 'nest-casl';
import { OrderEntity } from '../entities';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { OrdersHook } from '../hooks';
import { afterAndBefore } from '../../../../util/helper';
import { ProductEntity } from '../../products/entities';
import { ProductsService } from '../../products/services';

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
