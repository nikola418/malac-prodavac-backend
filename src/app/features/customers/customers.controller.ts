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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomerEntity } from './entities';
import { Public } from '../../common/decorators';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto } from '../../core/prisma/dto';
import { serializePagination } from '../../common/helpers';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CustomersHook } from './customers.hook';

@ApiTags('Customers')
@Controller('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    console.log(createCustomerDto);
    return new CustomerEntity(
      await this.customersService.create(createCustomerDto),
    );
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, CustomerEntity)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(new DirectFilterPipe<any, Prisma.CustomerWhereInput>([]))
    filterDto: FilterDto<Prisma.CustomerWhereInput>,
  ) {
    return serializePagination(
      CustomerEntity,
      this.customersService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, CustomerEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new CustomerEntity(await this.customersService.findOne({ id }));
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, CustomerEntity, CustomersHook)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return new CustomerEntity(
      await this.customersService.update(id, updateCustomerDto),
    );
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, CustomerEntity, CustomersHook)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
