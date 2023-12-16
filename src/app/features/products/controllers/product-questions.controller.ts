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
import { ProductEntity, ProductQuestionEntity } from '../entities';
import { ProductQuestionsService } from '../services';

@UseGuards(AccessGuard)
@ApiTags('products')
@Controller('products/:id/questions')
export class ProductQuestionsController {
  constructor(
    private readonly productQuestionsService: ProductQuestionsService,
  ) {}

  @Post()
  @UseAbility(Actions.aggregate, ProductEntity)
  @UseAbility(Actions.create, ProductQuestionEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateProductQuestionDto,
    @AuthUser() user: JWTPayloadUser,
  ): Promise<ProductQuestionEntity> {
    return new ProductQuestionEntity(
      await this.productQuestionsService.create({
        productId,
        customerId: user.customer?.id,
        text: dto.text,
      }),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, ProductQuestionEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) productId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ProductQuestionWhereInput>(
        ['productId', 'customerId', 'updatedAt', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ProductQuestionWhereInput>,
  ): Promise<PaginationResponse<ProductQuestionEntity>> {
    return serializePagination(
      ProductQuestionEntity,
      this.productQuestionsService.findAll(
        {
          ...filterDto.findOptions,
          where: { ...filterDto.findOptions.where, productId },
        },
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':customerId')
  @UseAbility(Actions.read, ProductQuestionEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<ProductQuestionEntity> {
    return new ProductQuestionEntity(
      await this.productQuestionsService.findOne({
        productId_customerId: { productId, customerId },
      }),
    );
  }
}
