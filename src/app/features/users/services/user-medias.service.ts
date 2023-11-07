import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../../core/prisma';
import { Cursors, pageAndLimit } from '../../../../util/helper';

@Injectable()
export class UserMediasService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.UserMediaInclude = {};

  upsert(image: Express.Multer.File, id: number) {
    return this.prisma.client.userMedia.upsert({
      create: {
        key: image.filename,
        mimetype: image.mimetype,
        originalName: image.originalname,
        user: { connect: { id: id } },
      },
      update: {
        key: image.filename,
        mimetype: image.mimetype,
        originalName: image.originalname,
      },
      where: { userId: id },
    });
  }

  findAll(id: number, args: Prisma.UserMediaFindManyArgs, cursors: Cursors) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.userMedia.paginate({
      where: { ...args.where, userId: id },
      orderBy: args.orderBy,
      include: args.include ?? UserMediasService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({
          ...cursors,
          limit,
        });
  }

  async findOne(
    where: Prisma.UserMediaWhereUniqueInput,
    include?: Prisma.UserMediaInclude,
  ) {
    return await this.prisma.client.userMedia.findUniqueOrThrow({
      where,
      include: include ?? UserMediasService.include,
    });
  }

  async findFirst(
    where: Prisma.UserMediaWhereInput,
    include?: Prisma.UserMediaInclude,
  ) {
    return await this.prisma.client.userMedia.findFirstOrThrow({
      where,
      include: include ?? UserMediasService.include,
    });
  }

  async remove(userId: number, id: number) {
    return this.prisma.client.userMedia.delete({ where: { userId, id } });
  }
}
