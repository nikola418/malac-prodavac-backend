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
import { SellersService } from './sellers.service';
import { ApiTags } from '@nestjs/swagger';
import { SellerEntity } from './entities';
import { CreateSellerDto, UpdateSellerDto } from './dto';
import { Public } from '../../common/decorators';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { serializePagination } from '../../common/helpers';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { SellersHook } from './sellers.hook';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSellerDto: CreateSellerDto) {
    return new SellerEntity(await this.sellersService.create(createSellerDto));
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, SellerEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.SellerWhereInput>([]))
    filterDto: FilterDto<Prisma.SellerWhereInput>,
  ) {
    return serializePagination(
      SellerEntity,
      this.sellersService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, SellerEntity)
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new SellerEntity(await this.sellersService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, SellerEntity, SellersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return new SellerEntity(
      await this.sellersService.update(id, updateSellerDto),
    );
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, SellerEntity, SellersHook)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.remove(id);
  }
}
