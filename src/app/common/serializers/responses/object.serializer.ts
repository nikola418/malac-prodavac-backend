import { instanceToPlain } from 'class-transformer';

/**
 * @param object any object
 * @param outputType wrapper class
 * @returns wrapped object
 */
export const serializeObject = <T>(
  object: any,
  outputType: new (object: any) => T,
) => {
  return instanceToPlain(wrapObject(object, outputType));
};

/**
 * @param object any object
 * @param outputType wrapper class
 * @returns wrapped object
 */
export const wrapObject = <T>(
  object: any,
  outputType: new (object: any) => T,
) => {
  // example: new UserEntity(req.user)
  return new outputType(object);
};
