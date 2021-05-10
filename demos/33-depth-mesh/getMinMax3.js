/**
 * @author Ikaros Kappler
 * @date 2021-02-22
 * @version 1.0.0
 */

/**
 * Measure the min/max values of a set of 3D points.
 *
 * @param {Vert3[]} vertices
 * @returns { min : Vert3, max : Vert3, width : number, height : number, depth: number }
 */
var getMinMax = function (vertices) {
  var min = new Vert3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  var max = new Vert3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
  for (var v in vertices) {
    var vert = vertices[v];
    min.x = Math.min(min.x, vert.x);
    min.y = Math.min(min.y, vert.y);
    min.z = Math.min(min.z, vert.z);
    max.x = Math.max(max.x, vert.x);
    max.y = Math.max(max.y, vert.y);
    max.z = Math.max(max.z, vert.z);
  }
  return { min: min, max: max, width: max.x - min.x, height: max.y - min.y, depth: max.z - min.z };
};
