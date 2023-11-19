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
import { FavoriteShopsService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';
import { afterAndBefore } from '../../../../util/helper';
import { CustomerEntity, FavoriteShopEntity } from '../entities';
import { CustomersHook, FavoriteShopsHook } from '../hooks';
import { CreateFavoriteShopDto } from '../dto';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/favoriteShops')
export class FavoriteShopsController {
  constructor(private favoriteShopsService: FavoriteShopsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.create, FavoriteShopEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createFavoriteShopDto: CreateFavoriteShopDto,
  ) {
    return new FavoriteShopEntity(
      await this.favoriteShopsService.create(id, createFavoriteShopDto),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.read, FavoriteShopEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.FavoriteShopWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.FavoriteShopWhereInput>,
  ) {
    return serializePagination(
      FavoriteShopEntity,
      this.favoriteShopsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        customerId,
      ),
    );
  }

  @Delete(':favoriteShopId')
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.delete, FavoriteShopEntity, FavoriteShopsHook)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('favoriteShopId', ParseIntPipe) favoriteShopId: number,
  ) {
    return new FavoriteShopEntity(
      await this.favoriteShopsService.remove(id, favoriteShopId),
    );
  }
}
