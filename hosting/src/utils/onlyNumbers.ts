export const onlyNumbers = (data: unknown): data is number => {
  return typeof data === 'number';
};
