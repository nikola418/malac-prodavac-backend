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
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BuyerEntity } from './entities';
import { Public } from 'src/app/common/decorators';
import { serializeArray } from 'src/app/common/serializers/responses/array.serializer';
import { User } from '@prisma/client';
import { UserEntity } from '../users/entities';
import { PaginationResultEntity } from 'src/app/common/helpers/entities';

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
  @ApiOkResponse({ type: PaginationResultEntity<UserEntity> })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return serializeArray<User, UserEntity>(
      await this.buyersService.findAll(),
      UserEntity,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buyersService.findOne(id);
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
