import { ClassConstructor, plainToInstance } from 'class-transformer';
export type PaginationResult<T> = [T[], any];

export const serializePagination = async <T>(
  cls: ClassConstructor<T>,
  paginationResult: Promise<PaginationResult<T>>,
) => {
  const result = await paginationResult;
  result[0] = plainToInstance(cls, result[0]);
  return { data: result[0], meta: result[1] };
};
