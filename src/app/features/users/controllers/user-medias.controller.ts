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
import { ApiFile } from '../../../common/decorators';
import { FilterDto } from '../../../core/prisma/dto';
import { UserEntity, UserMediaEntity } from '../entities';
import { UsersHook } from '../hooks/users.hook';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { appConfigFactory } from '../../../core/configuration/app';
import { ConfigType } from '@nestjs/config';
import { serializePagination } from '../../../common/helpers';
import { fileMimetypeFilter } from '../../../core/files';
import { UserMediasHook } from '../hooks';

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
  async upsert(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    image: Express.Multer.File,
  ) {
    return new UserMediaEntity(await this.userMediasService.upsert(image, id));
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
  @UseAbility(Actions.read, UserMediaEntity, UserMediasHook)
  @HttpCode(HttpStatus.CREATED)
  async findOne(
    @Param('id', ParseIntPipe) userId: number,
    @Param('mediaId', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const media = await this.userMediasService.findOne({
      userId,
      id,
    });

    const file = createReadStream(
      join(
        process.cwd(),
        `${this.config.multerDest}/${this.config.userMediaDest}/${media.key}`,
      ),
    );

    res.set({
      'Content-Type': media.mimetype,
      'Content-Disposition': 'inline',
    });

    return new StreamableFile(file);
  }

  @Delete(':mediaId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserMediaEntity, UserMediasHook)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('mediaId', ParseIntPipe) id: number) {
    return new UserMediaEntity(await this.userMediasService.remove(id));
  }
}
