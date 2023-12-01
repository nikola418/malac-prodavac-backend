/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
} from '@nestjs/common';
import { ApkService } from './apk.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiFile, Public } from '../../common/decorators';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ConfigType } from '@nestjs/config';
import { appConfigFactory } from '../../core/configuration/app';
import { Response } from 'express';

@Public()
@ApiTags('apk')
@Controller('apk')
export class ApkController {
  constructor(
    private readonly apkService: ApkService,
    @Inject(appConfigFactory.KEY)
    private config: ConfigType<typeof appConfigFactory>,
  ) {}

  @Post()
  @ApiFile('apk', true)
  @HttpCode(HttpStatus.CREATED)
  async upsert(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'application/vnd.android.package-archive',
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        }),
    )
    apk: Express.Multer.File,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findOne(@Res({ passthrough: true }) res: Response) {
    const file = createReadStream(
      join(
        process.cwd(),
        `${this.config.multerDest}/${this.config.apkDest}/malac-prodavac.apk`,
      ),
    );

    res.set({
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename=triforce_malac-prodavac.apk',
    });

    return new StreamableFile(file);
  }
}
