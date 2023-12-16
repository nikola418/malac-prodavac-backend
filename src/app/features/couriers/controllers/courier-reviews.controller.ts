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
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CourierReviewsService } from '../services/courier-reviews.service';
import { CourierEntity, CourierReviewEntity } from '../entities';
import { CouriersHook } from '../hooks';
import { CreateCourierReviewDto } from '../dto';
import { Prisma } from '@prisma/client';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { afterAndBefore } from '../../../../util/helper';
import { AuthUser } from '../../../common/decorators';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';

@UseGuards(AccessGuard)
@ApiTags('couriers')
@Controller('couriers/:id/courier-reviews')
export class CourierReviewsController {
  constructor(private courierReviewsService: CourierReviewsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CourierEntity, CouriersHook)
  @UseAbility(Actions.create, CourierReviewEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) courierId: number,
    @Body() dto: CreateCourierReviewDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new CourierReviewEntity(
      await this.courierReviewsService.create(courierId, dto, user),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, CourierReviewEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) courierId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.CourierReviewWhereInput>(
        ['courierId', 'shopId', 'updatedAt', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.CourierReviewWhereInput>,
  ) {
    return serializePagination(
      CourierReviewEntity,
      this.courierReviewsService.findAll(
        courierId,
        filterDto.findOptions,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':shopId')
  @UseAbility(Actions.read, CourierReviewEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) courierId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ) {
    return new CourierReviewEntity(
      await this.courierReviewsService.findOne({
        courierId_shopId: { courierId, shopId },
      }),
    );
  }
}
