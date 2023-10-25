import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Put,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserMediasService } from '../services';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { AccessGuard, UseAbility, Actions } from 'nest-casl';
import { ApiFile, NoAutoSerialize } from '../../../common/decorators';
import { FilterDto } from '../../../core/prisma/dto';
import { UserEntity, UserMediaEntity } from '../entities';
import { UsersHook } from '../users.hook';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { appConfigFactory } from '../../../core/configuration/app';
import { ConfigType } from '@nestjs/config';
import { serializePagination } from '../../../common/helpers';
import { fileMimetypeFilter } from '../../../core/files';

@ApiTags('users')
@Controller('users/:id/medias')
export class UserMediasController {
  constructor(
    private userMediasService: UserMediasService,
    @Inject(appConfigFactory.KEY)
    private config: ConfigType<typeof appConfigFactory>,
  ) {}

  @Put()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserEntity, UsersHook)
  @ApiFile('image', true, {
    fileFilter: fileMimetypeFilter('image/jpeg', 'image/png'),
  })
  async create(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    image: Express.Multer.File,
  ) {
    console.log(image);
    return new UserMediaEntity(await this.userMediasService.create(image, id));
  }

  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity, UsersHook)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) id: number,
    @Query(new DirectFilterPipe<any, Prisma.UserMediaWhereInput>([]))
    filterDto: FilterDto<Prisma.UserMediaWhereInput>,
  ) {
    return serializePagination(
      UserMediaEntity,
      this.userMediasService.findAll(id, filterDto.findOptions),
    );
  }

  @Get(':mediaId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity, UsersHook)
  @HttpCode(HttpStatus.CREATED)
  async findOne(
    @Param('id', ParseIntPipe) userId: number,
    @Param('mediaId', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const media = await this.userMediasService.findOne({
      id,
      userId,
    });
    const file = createReadStream(
      join(process.cwd(), `${this.config.multerDest}/${media.key}`),
    );
    res.set({
      'Content-Type': media.mimetype,
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(file);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserEntity, UsersHook)
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserMediaEntity(await this.userMediasService.remove(id));
  }
}
