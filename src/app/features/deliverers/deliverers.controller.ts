import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DeliverersService } from './deliverers.service';
import { CreateDelivererDto, UpdateDelivererDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { DelivererEntity } from './entities';
import { Public } from '../../common/decorators';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { serializePagination } from '../../common/helpers';
import { DeliverersHook } from './deliverers.hook';

@ApiTags('deliverers')
@Controller('deliverers')
export class DeliverersController {
  constructor(private readonly deliverersService: DeliverersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDelivererDto: CreateDelivererDto) {
    return new DelivererEntity(
      await this.deliverersService.create(createDelivererDto),
    );
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, DelivererEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.DelivererWhereInput>([]))
    filterDto: FilterDto<Prisma.DelivererWhereInput>,
  ) {
    return serializePagination(
      DelivererEntity,
      this.deliverersService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, DelivererEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new DelivererEntity(await this.deliverersService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, DelivererEntity, DeliverersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    return new DelivererEntity(
      await this.deliverersService.update(id, updateDelivererDto),
    );
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, DelivererEntity, DeliverersHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new DelivererEntity(await this.deliverersService.remove(id));
  }
}
