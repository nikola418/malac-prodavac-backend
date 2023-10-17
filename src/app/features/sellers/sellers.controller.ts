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
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/common/decorators';
import { plainToInstance } from 'class-transformer';
import { BuyerEntity } from '../buyers/entities';
import { SellerEntity } from './entities';
import { CreateSellerDto, UpdateSellerDto } from './dto';

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

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return plainToInstance(BuyerEntity, this.sellersService.findAll());
  }

  @Get(':id')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new BuyerEntity(await this.sellersService.findOne(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    return this.sellersService.update(id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.remove(id);
  }
}
