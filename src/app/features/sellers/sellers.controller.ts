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
import { plainToInstance } from 'class-transformer';
import { SellerEntity } from './entities';
import { CreateSellerDto, UpdateSellerDto } from './dto';
import { Public } from '../../common/decorators';

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
    return plainToInstance(SellerEntity, this.sellersService.findAll());
  }

  @Get(':id')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new SellerEntity(await this.sellersService.findOne(id));
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
