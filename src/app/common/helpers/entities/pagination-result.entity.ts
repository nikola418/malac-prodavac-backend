import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from '../../interfaces';

class PaginationtMetaEntity implements PaginationMeta {
  skip: number;

  limit: number;

  countTotal: number;

  countFiltered: number;
}

export class PaginationResultEntity<T> {
  meta: PaginationtMetaEntity;
  @ApiProperty({ isArray: true, example: [{}] })
  result: Array<T>;
}
