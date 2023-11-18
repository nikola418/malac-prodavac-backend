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
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import { CustomersHook, FavoriteProductsHook } from '../hooks';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/favoriteProducts')
export class FavoriteProductsController {
  constructor(private favoriteProductsService: FavoriteProductsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.create, FavoriteProductEntity)
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
    @Param('id', ParseIntPipe) id: number,
    @Query(
      new DirectFilterPipe<any, Prisma.FavoriteProductWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.FavoriteProductWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      FavoriteProductEntity,
      this.favoriteProductsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Delete(':favoriteProductId')
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.delete, FavoriteProductEntity, FavoriteProductsHook)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('favoriteProductId', ParseIntPipe) favoriteProductId: number,
  ) {
    return new FavoriteProductEntity(
      await this.favoriteProductsService.remove(id, favoriteProductId),
    );
  }
}
