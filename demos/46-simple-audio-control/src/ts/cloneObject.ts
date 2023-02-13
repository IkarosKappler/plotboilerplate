export const cloneObject = <T extends object>(obj: T) => {
  return Object.assign({}, obj) as T;
};
