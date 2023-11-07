import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class ProductMediasService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.ProductMediaInclude = {};

  create(id: number, images: Express.Multer.File[]) {
    return this.prisma.client.productMedia.createMany({
      data: images.map((image) => ({
        productId: id,
        key: image.filename,
        originalName: image.originalname,
        mimetype: image.mimetype,
      })),
      skipDuplicates: true,
    });
  }

  findAll(
    productId: number,
    args: Prisma.ProductMediaFindManyArgs,
    cursors: Cursors,
  ) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.productMedia.paginate({
      where: { ...args.where, productId },
      orderBy: args.orderBy,
      include: args.include ?? ProductMediasService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.ProductMediaWhereUniqueInput,
    include?: Prisma.ProductMediaInclude,
  ) {
    return this.prisma.client.productMedia.findUniqueOrThrow({
      where,
      include: include ?? ProductMediasService.include,
    });
  }

  remove(productId: number, id: number) {
    return this.prisma.client.productMedia.delete({ where: { productId, id } });
  }
}
