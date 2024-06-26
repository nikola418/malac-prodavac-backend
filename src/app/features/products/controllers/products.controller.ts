import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard, AccessService, Actions, UseAbility } from 'nest-casl';
import { ProductEntity } from '../entities';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { AuthUser } from '../../../common/decorators';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { ProductsHook } from '../hooks';
import { afterAndBefore } from '../../../../util/helper';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private accessService: AccessService,
  ) {}

  @Post()
  @UseAbility(Actions.create, ProductEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ProductEntity(
      await this.productsService.create(createProductDto, user),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.ProductWhereInput>(
        [
          'id',
          'categoryId',
          'shopId',
          'title',
          'price',
          'currency',
          'unitOfMeasurement',
          'rating',
          'availableAt',
          'desc',
          'available',
          'createdAt',
          'updatedAt',
        ],
        [...cursorQueries, 'category.parentCategoryId'],
      ),
    )
    filterDto: FilterDto<Prisma.ProductWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      ProductEntity,
      this.productsService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ProductEntity(await this.productsService.findOne({ id }, user));
  }

  @Patch(':id')
  @UseAbility(Actions.update, ProductEntity, ProductsHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return new ProductEntity(
      await this.productsService.update(id, updateProductDto),
    );
  }

  @Delete(':id')
  @UseAbility(Actions.delete, ProductEntity, ProductsHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ProductEntity(await this.productsService.remove(id));
  }
}
