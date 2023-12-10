import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShopsService } from '../services/shops.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ShopEntity } from '../entities';
import { CreateShopDto, UpdateShopDto } from '../dto';
import { AuthUser, Public } from '../../../common/decorators';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { ShopsHook } from '../hooks/shops.hook';
import { afterAndBefore } from '../../../../util/helper';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShopDto: CreateShopDto) {
    return new ShopEntity(await this.shopsService.create(createShopDto));
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ShopEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.ShopWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ShopWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      ShopEntity,
      this.shopsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ShopEntity, ShopsHook)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ShopEntity(await this.shopsService.findOne({ id }, user));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, ShopEntity, ShopsHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return new ShopEntity(await this.shopsService.update(id, updateShopDto));
  }
}
