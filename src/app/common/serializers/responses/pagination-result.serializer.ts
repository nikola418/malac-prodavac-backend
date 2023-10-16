import { PaginationResultEntity } from '../../helpers/entities';
import { serializeArray } from './array.serializer';

/**
 * @param paginationResult data records retrieved from the service
 * @param outputType entity class wrapping pagination result object/s
 * @returns same result as the input, but with result wrapped in entity class
 */
export const serializePaginationResult = async <T, U>(
  paginationResult:
    | Promise<PaginationResultEntity<T>>
    | PaginationResultEntity<T>,
  outputType: new (object: any) => U,
) => {
  const paginationResultPromise = Promise.resolve(paginationResult);
  const resolvedPaginationResult: PaginationResultEntity<T> =
    await paginationResultPromise;

  const resolvedPaginationResultResultPromise = Promise.resolve(
    serializeArray<T, U>(
      resolvedPaginationResult.result,
      outputType,
    ) as unknown as Array<T>,
  );
  resolvedPaginationResult.result = await resolvedPaginationResultResultPromise;

  return resolvedPaginationResult as unknown as PaginationResultEntity<U>;
};
