import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import {
  ExtendedPrismaClient,
  ExtendedPrismaClientKey,
} from '../../core/prisma';
import { Cursors, pageAndLimit } from '../../../util/helper';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(ExtendedPrismaClientKey)
    private prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  static readonly include: Prisma.CategoryInclude = { subCategories: true };

  findAll(args: Prisma.CategoryFindManyArgs, cursors: Cursors) {
    const { page, limit } = pageAndLimit(args);

    const query = this.prisma.client.category.paginate({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include ?? CategoriesService.include,
    });

    return page
      ? query.withPages({ page, limit })
      : query.withCursor({ ...cursors, limit });
  }

  findOne(
    where: Prisma.CategoryWhereUniqueInput,
    include?: Prisma.CategoryInclude,
  ) {
    return this.prisma.client.category.findFirstOrThrow({
      where,
      include: include ?? CategoriesService.include,
    });
  }
}
