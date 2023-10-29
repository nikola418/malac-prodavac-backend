import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductReviewsService } from '../services';
import { CreateProductReviewDto } from '../dto';
import { ProductReviewEntity } from '../entities/product-review.entity';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../../core/prisma/dto';
import { serializePagination } from '../../../common/helpers';

@ApiTags('products')
@Controller('products/:id/reviews')
export class ProductReviewsController {
  constructor(private productReviewsService: ProductReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createProductReviewDto: CreateProductReviewDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new ProductReviewEntity(
      await this.productReviewsService.create(
        productId,
        createProductReviewDto,
        user,
      ),
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Query(new DirectFilterPipe<any, Prisma.ReviewWhereInput>([]))
    filterDto: FilterDto<Prisma.ReviewWhereInput>,
  ) {
    return serializePagination(
      ProductReviewEntity,
      this.productReviewsService.findAll(productId, filterDto.findOptions),
    );
  }

  @Get(':reviewId')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) id: number,
  ) {
    return new ProductReviewEntity(
      await this.productReviewsService.findOne({ productId, id }),
    );
  }
}
