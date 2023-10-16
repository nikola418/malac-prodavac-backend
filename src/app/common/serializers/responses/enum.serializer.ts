export const serializeEnum = <T>(enumObj: { [key: string]: T }) => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ name: enumObj[key], value: enumObj[key] }));
};
