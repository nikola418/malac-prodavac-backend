import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliverersService } from './deliverers.service';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { UpdateDelivererDto } from './dto/update-deliverer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('deliverers')
@Controller('deliverers')
export class DeliverersController {
  constructor(private readonly deliverersService: DeliverersService) {}

  @Post()
  create(@Body() createDelivererDto: CreateDelivererDto) {
    return this.deliverersService.create(createDelivererDto);
  }

  @Get()
  findAll() {
    return this.deliverersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliverersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDelivererDto: UpdateDelivererDto,
  ) {
    return this.deliverersService.update(+id, updateDelivererDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliverersService.remove(+id);
  }
}
