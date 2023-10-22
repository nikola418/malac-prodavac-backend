import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { serializePagination } from '../../common/helpers';
import { FilterDto } from '../../core/prisma/dto';
import { UserEntity } from './entities';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new DirectFilterPipe<any, Prisma.UserWhereInput>([]))
    filterDto: FilterDto<Prisma.UserWhereInput>,
  ) {
    return serializePagination(
      UserEntity,
      this.usersService.findAll(filterDto.findOptions),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity)
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne({ id }));
  }
}
