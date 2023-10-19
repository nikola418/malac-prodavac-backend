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
} from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { CreateBuyerDto, UpdateBuyerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { BuyerEntity } from './entities';
import { Public } from '../../common/decorators';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { serializePagination } from '../../common/helpers/serialize-pagination.helper';

@ApiTags('buyers')
@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBuyerDto: CreateBuyerDto) {
    return new BuyerEntity(await this.buyersService.create(createBuyerDto));
  }

  @Public()
  @Get()
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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new BuyerEntity(await this.buyersService.findOne(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    return this.buyersService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buyersService.remove(id);
  }
}
