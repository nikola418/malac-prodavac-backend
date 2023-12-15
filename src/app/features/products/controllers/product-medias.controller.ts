import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  Inject,
  StreamableFile,
  ParseFilePipeBuilder,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ProductEntity, ProductMediaEntity } from '../entities';
import {
  PaginationResponse,
  serializePagination,
} from '../../../common/helpers';
import { ApiFile, Public } from '../../../common/decorators';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { Prisma } from '@prisma/client';
import { FilterDto, cursorQueries } from '../../../core/prisma/dto';
import { ProductsHook } from '../hooks/products.hook';
import { ConfigType } from '@nestjs/config';
import { appConfigFactory } from '../../../core/configuration/app';
import { ProductMediasService } from '../services';
import { createReadStream } from 'fs';
import { join } from 'path';
import { afterAndBefore } from '../../../../util/helper';

@ApiTags('products')
@Controller('products/:id/medias')
export class ProductMediasController {
  constructor(
    private readonly productMediasService: ProductMediasService,
    @Inject(appConfigFactory.KEY)
    private config: ConfigType<typeof appConfigFactory>,
  ) {}

  @Put()
  @ApiFile('image', true)
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, ProductEntity, ProductsHook)
  @UseAbility(Actions.create, ProductMediaEntity)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(^image)(\/)[a-zA-Z0-9_]*/gm })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        }),
    )
    image: Express.Multer.File,
  ) {
    return new ProductMediaEntity(
      await this.productMediasService.upsert(id, image),
    );
  }

  @ApiOkResponse({ type: PaginationResponse })
  @Get()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('id', ParseIntPipe) id: number,
    @Query(
      new DirectFilterPipe<any, Prisma.ProductMediaWhereInput>(
        ['id', 'createdAt'],
        [...cursorQueries],
      ),
    )
    filterDto: FilterDto<Prisma.ProductMediaWhereInput>,
  ) {
    return serializePagination(
      ProductMediaEntity,
      this.productMediasService.findAll(
        id,
        filterDto.findOptions,
        afterAndBefore(filterDto),
      ),
    );
  }

  @Public()
  @Get(':mediaId')
  @UseAbility(Actions.read, ProductEntity)
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) productId: number,
    @Param('mediaId', ParseIntPipe) id: number,
  ) {
    const media = await this.productMediasService.findOne({
      id,
      productId,
    });

    const file = createReadStream(
      join(
        process.cwd(),
        `${this.config.multerDest}/${this.config.productMediaDest}/${media.key}`,
      ),
    );

    return new StreamableFile(file, {
      disposition: 'inline',
      type: media.mimetype,
    });
  }

  @Delete(':mediaId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, ProductEntity, ProductsHook)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) productId: number,
    @Param('mediaId', ParseIntPipe) id: number,
  ) {
    return new ProductMediaEntity(
      await this.productMediasService.remove(productId, id),
    );
  }
}
