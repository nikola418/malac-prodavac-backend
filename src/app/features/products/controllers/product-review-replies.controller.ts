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
import { ApiTags } from '@nestjs/swagger';
import { ProductReviewReplyEntity } from '../entities';
import { CreateProductReviewReplyDto } from '../dto';
import { ProductReviewRepliesService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto } from '../../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import { serializePagination } from '../../../common/helpers';

@ApiTags('products')
@Controller('produts/:id/reviews/:id/replies')
export class ProductReviewRepliesController {
  constructor(
    private productReviewRepliesService: ProductReviewRepliesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() createProductReviewReplyDto: CreateProductReviewReplyDto,
  ) {
    return new ProductReviewReplyEntity(
      await this.productReviewRepliesService.create(
        productId,
        reviewId,
        createProductReviewReplyDto,
      ),
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Query(new DirectFilterPipe<any, Prisma.ReviewReplyWhereInput>([]))
    filterDto: FilterDto<Prisma.ReviewReplyWhereInput>,
  ) {
    return serializePagination(
      ProductReviewReplyEntity,
      this.productReviewRepliesService.findAll(
        productId,
        reviewId,
        filterDto.findOptions,
      ),
    );
  }

  @Get(':replyId')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Param('replyId', ParseIntPipe) replyId: number,
  ) {
    return new ProductReviewReplyEntity(
      await this.productReviewRepliesService.findOne({
        id: replyId,
        review: { id: reviewId, productId },
      }),
    );
  }
}
