import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export class PaginationMeta {
  @ApiProperty()
  hasPreviousPage: boolean;
  @ApiProperty()
  hasNextPage: boolean;
  @ApiProperty()
  startCursor: string | null;
  @ApiProperty()
  endCursor: string | null;
  @ApiProperty()
  isFirstPage: boolean;
  @ApiProperty()
  isLastPage: boolean;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  previousPage: number | null;
  @ApiProperty()
  nextPage: number | null;
  @ApiProperty()
  pageCount: number;
  @ApiProperty()
  totalCount: number;
}

export class PaginationResponse<T> {
  @ApiProperty({ type: Object, isArray: true })
  data: T[];
  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;
}

export const serializePagination = async <T>(
  cls: ClassConstructor<T>,
  paginationResult: Promise<any>,
): Promise<PaginationResponse<T>> => {
  const result = await paginationResult;

  return {
    data: plainToInstance(cls, result[0]) as T[],
    meta: result[1],
  };
};
