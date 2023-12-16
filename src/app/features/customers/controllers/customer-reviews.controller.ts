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
import { CreateCustomerReviewDto } from '../dto/create-customer-review.dto';
import { CustomerReviewsService } from '../services';
import { CustomerEntity, CustomerReviewEntity } from '../entities';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { AuthUser } from '../../../common/decorators';
import { CustomersHook } from '../hooks';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { afterAndBefore } from '../../../../util/helper';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { cursorQueries, FilterDto } from '../../../core/prisma/dto';

@UseGuards(AccessGuard)
@ApiTags('customers')
@Controller('customers/:id/customer-reviews')
export class CustomerReviewsController {
  constructor(private customerReviewsService: CustomerReviewsService) {}

  @Post()
  @UseAbility(Actions.aggregate, CustomerEntity, CustomersHook)
  @UseAbility(Actions.create, CustomerReviewEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) customerId: number,
    @Body() dto: CreateCustomerReviewDto,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return new CustomerReviewEntity(
      await this.customerReviewsService.create(customerId, dto, user),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseAbility(Actions.read, CustomerReviewEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) customerId: number,
    @Query(
      new DirectFilterPipe<any, Prisma.CustomerReviewWhereInput>(
        ['customerId', 'updatedAt', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.CustomerReviewWhereInput>,
  ) {
    return serializePagination(
      CustomerReviewEntity,
      this.customerReviewsService.findAll(
        customerId,
        filterDto.findOptions,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':shopId')
  @UseAbility(Actions.read, CustomerReviewEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) customerId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ) {
    return new CustomerReviewEntity(
      await this.customerReviewsService.findOne({
        customerId_shopId: { customerId, shopId },
      }),
    );
  }
}
