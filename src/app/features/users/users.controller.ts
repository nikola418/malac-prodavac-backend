import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
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
import { UsersHook } from './users.hook';
import { Response } from 'express';
import { NoAutoSerialize } from '../../common/decorators';
import { plainToInstance } from 'class-transformer';

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

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserEntity, UsersHook)
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return res.json(
      plainToInstance(UserEntity, await this.usersService.remove(id, res)),
    );
  }
}
