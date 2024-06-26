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
import { CouriersService } from '../services/couriers.service';
import { CreateCourierDto, UpdateCourierDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CourierEntity } from '../entities';
import { AuthUser, Public } from '../../../common/decorators';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { CouriersHook } from '../hooks/couriers.hook';
import { afterAndBefore } from '../../../../util/helper';
import { JWTPayloadUser } from '../../../core/authentication/jwt';

@ApiTags('couriers')
@Controller('couriers')
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourierDto: CreateCourierDto) {
    return new CourierEntity(
      await this.couriersService.create(createCourierDto),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, CourierEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.CourierWhereInput>(
        [
          'id',
          'routeStartLatitude',
          'routeStartLongitude',
          'routeEndLatitude',
          'routeEndLongitude',
          'createdAt',
        ],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.CourierWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      CourierEntity,
      this.couriersService.findAll(
        filterDto.findOptions,
        afterAndBefore(filterDto),
        user,
      ),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, CourierEntity, CouriersHook)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new CourierEntity(await this.couriersService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, CourierEntity, CouriersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourierDto: UpdateCourierDto,
  ) {
    return new CourierEntity(
      await this.couriersService.update(id, updateCourierDto),
    );
  }
}
