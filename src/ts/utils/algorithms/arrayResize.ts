/**
 * Resize a given array to a desired number of elements by adding or removing some.
 *
 * @author  Ikaros Kappler
 * @date    2024-02-07
 * @version 1.0.0
 */

export const arrayResize = <T>(arr: Array<T>, desiredSize: number, factoryFn: () => T) => {
  if (arr.length === desiredSize) {
    // No change required
    return;
  }

  while (arr.length < desiredSize) {
    arr.push(factoryFn());
  }

  if (arr.length > desiredSize) {
    arr.splice(desiredSize);
  }
};
