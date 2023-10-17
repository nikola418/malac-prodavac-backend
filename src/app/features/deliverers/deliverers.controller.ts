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
import { DeliverersService } from './deliverers.service';
import { CreateDelivererDto, UpdateDelivererDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/common/decorators';
import { DelivererEntity } from './entities';
import { plainToInstance } from 'class-transformer';

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

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return plainToInstance(DelivererEntity, this.deliverersService.findAll());
  }

  @Get(':id')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new DelivererEntity(await this.deliverersService.findOne(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    return this.deliverersService.update(id, updateDelivererDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deliverersService.remove(id);
  }
}
