import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FavoriteProductsService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';
import { afterAndBefore } from '../../../../util/helper';
import { CustomerEntity, FavoriteProductEntity } from '../entities';
import { CreateFavoriteProductDto } from '../dto';
import { CustomersHook, FavoriteProductsHook } from '../hooks';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/favoriteProducts')
export class FavoriteProductsController {
  constructor(private favoriteProductsService: FavoriteProductsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.create, FavoriteProductEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    createFavoriteProduct: CreateFavoriteProductDto,
  ) {
    return new FavoriteProductEntity(
      await this.favoriteProductsService.create(id, createFavoriteProduct),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.read, FavoriteProductEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.FavoriteProductWhereInput>(
        ['id', 'productId', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.FavoriteProductWhereInput>,
  ) {
    return serializePagination(
      FavoriteProductEntity,
      this.favoriteProductsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        customerId,
      ),
    );
  }

  @Delete(':favoriteProductId')
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.delete, FavoriteProductEntity, FavoriteProductsHook)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('favoriteProductId', ParseIntPipe) favoriteProductId: number,
  ) {
    return new FavoriteProductEntity(
      await this.favoriteProductsService.remove(id, favoriteProductId),
    );
  }
}
