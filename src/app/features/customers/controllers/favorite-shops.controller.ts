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
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/favoriteShops')
export class FavoriteShopsController {
  constructor(private favoriteShopsService: FavoriteShopsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.create, FavoriteShopEntity)
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
  @UseAbility(Actions.read, FavoriteShopEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.FavoriteShopWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.FavoriteShopWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      FavoriteShopEntity,
      this.favoriteShopsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Delete(':favoriteShopId')
  @UseAbility(Actions.delete, FavoriteShopEntity, FavoriteShopsHook)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('favoriteShopId', ParseIntPipe) favoriteShopId: number,
  ) {
    return new FavoriteShopEntity(
      await this.favoriteShopsService.remove(id, favoriteShopId),
    );
  }
}
