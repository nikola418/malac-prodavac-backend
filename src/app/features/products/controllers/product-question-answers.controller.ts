import { DirectFilterPipe } from '@chax-at/prisma-filter';
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
import { Prisma } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { afterAndBefore } from '../../../../util/helper';
import { AuthUser } from '../../../common/decorators';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { CreateProductQuestionDto } from '../dto';
import { ProductEntity, ProductQuestionAnswerEntity } from '../entities';
import { ProductQuestionAnswersService } from '../services';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products/:id/questions/:customerId/answers')
export class ProductQuestionAnswersController {
  constructor(
    private readonly productQuestionAnswersService: ProductQuestionAnswersService,
  ) {}

  @Post()
  @UseAbility(Actions.aggregate, ProductEntity)
  @UseAbility(Actions.create, ProductQuestionAnswerEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: CreateProductQuestionDto,
    @AuthUser() user: JWTPayloadUser,
  ): Promise<ProductQuestionAnswerEntity> {
    return new ProductQuestionAnswerEntity(
      await this.productQuestionAnswersService.create({
        productId,
        customerId: customerId,
        shopId: user.shop?.id,
        text: dto.text,
      }),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, ProductQuestionAnswerEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ProductQuestionAnswerWhereInput>(
        ['productId', 'customerId', 'shopId', 'updatedAt', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ProductQuestionAnswerWhereInput>,
  ): Promise<PaginationResponse<ProductQuestionAnswerEntity>> {
    return serializePagination(
      ProductQuestionAnswerEntity,
      this.productQuestionAnswersService.findAll(
        {
          ...filterDto.findOptions,
          where: { ...filterDto.findOptions.where, productId, customerId },
        },
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':shopId')
  @UseAbility(Actions.read, ProductQuestionAnswerEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ): Promise<ProductQuestionAnswerEntity> {
    return new ProductQuestionAnswerEntity(
      await this.productQuestionAnswersService.findOne({
        productId_customerId_shopId: { productId, customerId, shopId },
      }),
    );
  }
}
