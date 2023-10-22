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
  Query,
  UseGuards,
} from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto, UpdateBuyerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { BuyerEntity } from './entities';
import { Public } from '../../common/decorators';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { serializePagination } from '../../common/helpers';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { BuyersHook } from './buyers.hook';

@ApiTags('buyers')
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBuyerDto: CreateBuyerDto) {
    console.log(createBuyerDto);
    return new BuyerEntity(await this.buyersService.create(createBuyerDto));
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, BuyerEntity)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new DirectFilterPipe<any, Prisma.BuyerWhereInput>([]))
    filterDto: FilterDto<Prisma.BuyerWhereInput>,
  ) {
    return serializePagination(
      BuyerEntity,
      this.buyersService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, BuyerEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new BuyerEntity(await this.buyersService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BuyerEntity, BuyersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateBuyerDto: UpdateBuyerDto,
  ) {
    return new BuyerEntity(await this.buyersService.update(id, updateBuyerDto));
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, BuyerEntity, BuyersHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new BuyerEntity(await this.buyersService.remove(id));
  }
}
