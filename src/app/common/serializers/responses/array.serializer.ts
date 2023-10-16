import { serializeObject } from './object.serializer';

export const serializeArray = async <T, U>(
  array: Promise<Array<T>> | Array<T>,
  outputType: new (object: any) => U,
) => {
  const arrayPromise = Promise.resolve(array);
  const resolvedArray: Array<T> = await arrayPromise;

  return resolvedArray.map((object) => serializeObject(object, outputType));
};
