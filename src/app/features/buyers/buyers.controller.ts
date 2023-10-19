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
import { BuyersService } from './buyers.service';
import { CreateBuyerDto, UpdateBuyerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { BuyerEntity } from './entities';
import { plainToInstance } from 'class-transformer';
import { Public } from '../../common/decorators';

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
  async findAll() {
    return plainToInstance(BuyerEntity, this.buyersService.findAll());
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
