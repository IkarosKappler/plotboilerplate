/**
 * Get the Bounding box of the 3d wireframe geometry.
 *
 * @author Ikaros Kappler
 * @date 2021-04-19
 * @version 1.0.0
 *
 * @param {Vert3[]} geometryVertices
 * @returns { min : Vert3, max : Vert3 }
 */

var getGeometryBounds = function (geometryVertices) {
  var min = new Vert3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  var max = new Vert3(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
  for (var i in geometryVertices) {
    min.x = Math.min(geometryVertices[i].x, min.x);
    min.y = Math.min(geometryVertices[i].y, min.y);
    min.z = Math.min(geometryVertices[i].z, min.z);
    max.x = Math.max(geometryVertices[i].x, max.x);
    max.y = Math.max(geometryVertices[i].y, max.y);
    max.z = Math.max(geometryVertices[i].z, max.z);
  }
  return { min: min, max: max };
};
