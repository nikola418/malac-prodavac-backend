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
import { UsersService } from '../services/users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { UserEntity } from '../entities';
import { UsersHook } from '../hooks/users.hook';
import { Response } from 'express';
import { AuthUser } from '../../../common/decorators';
import { JWTPayloadUser } from '../../../core/authentication/jwt';
import { afterAndBefore } from '../../../../util/helper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(
      new DirectFilterPipe<any, Prisma.UserWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.UserWhereInput>,
    @AuthUser() user: JWTPayloadUser,
  ) {
    return serializePagination(
      UserEntity,
      this.usersService.findAll(
        filterDto.findOptions,
        user,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity, UsersHook)
  @HttpCode(HttpStatus.CREATED)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne({ id }));
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserEntity, UsersHook)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return new UserEntity(await this.usersService.remove(id, res));
  }
}
