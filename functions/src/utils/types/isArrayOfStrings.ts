export const isArrayOfStrings = (o: unknown[]): o is string[] => {
  return o.every(e => typeof e === 'string');
};
