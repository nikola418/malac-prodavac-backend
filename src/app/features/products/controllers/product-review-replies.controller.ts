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
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductReviewReplyEntity } from '../entities';
import { CreateProductReviewReplyDto } from '../dto';
import { ProductReviewRepliesService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { Prisma } from '@prisma/client';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { UseAbility, Actions, AccessGuard } from 'nest-casl';
import { ProductReviewEntity } from '../entities/product-review.entity';
import { ProductReviewsHook } from '../hooks';
import { afterAndBefore } from '../../../../util/helper';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products/:id/reviews/:reviewId/replies')
export class ProductReviewRepliesController {
  constructor(
    private productReviewRepliesService: ProductReviewRepliesService,
  ) {}

  @Post()
  @UseAbility(Actions.aggregate, ProductReviewEntity, ProductReviewsHook)
  @UseAbility(Actions.create, ProductReviewReplyEntity)
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

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, ProductReviewReplyEntity)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ReviewReplyWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ReviewReplyWhereInput>,
  ) {
    return serializePagination(
      ProductReviewReplyEntity,
      this.productReviewRepliesService.findAll(
        productId,
        reviewId,
        filterDto.findOptions,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':replyId')
  @UseAbility(Actions.read, ProductReviewReplyEntity)
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
