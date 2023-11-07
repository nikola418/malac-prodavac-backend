import { PageNumberPaginationOptions } from 'prisma-extension-pagination';
import { FilterDto } from '../../app/core/prisma/dto';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export const calculatePage = (offset: number, limit: number) => {
  return Math.floor(offset / limit) + 1;
};

export const pageAndLimit = <T>(
  findOptions: T,
): PageNumberPaginationOptions => {
  const { skip: offset, take: limit } = findOptions as GeneratedFindOptions<T>;
  const page = offset !== undefined ? calculatePage(offset, limit) : undefined;

  return { page, limit };
};

export type Cursors = { after: string | undefined; before: string | undefined };

export const afterAndBefore = <T>(filterDto: FilterDto<T>): Cursors => {
  const after = filterDto.filter?.find((filter) => filter.field === '!after')
    ?.value;
  const before = filterDto.filter?.find((filter) => filter.field === '!before')
    ?.value;

  return { after, before };
};

export type PagesAndCursors = {
  pages: PageNumberPaginationOptions;
  cursors: Cursors;
};
