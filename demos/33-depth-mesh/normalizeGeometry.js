/**
 * Normalize a given wireframe geometry to fit into a desired bounding box (default [-1,1] for x,y,z).
 *
 * @author Ikaros Kappler
 * @version 1.0.0
 * @date 2021-04-21
 * @param {*} geometryVertices
 */

var normalizeGeometry = function (geometryVertices) {
  // Desired bounds is a max bounding box. The object will be scaled keeping aspect ratio
  // in that way that the largest axis size touches the desired bounds.
  var desiredBounds = { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } };
  var bounds = getGeometryBounds(geometryVertices);
  var sizeX = bounds.max.x - bounds.min.x;
  var sizeY = bounds.max.y - bounds.min.y;
  var sizeZ = bounds.max.z - bounds.min.z;
  // Scale uniform so the dimension with the max expansion fits into [-1,1]
  var maxDimension = Math.max(sizeX, sizeY, sizeZ);
  var desiredSizeX = (desiredBounds.max.x - desiredBounds.min.x) / maxDimension;
  var desiredSizeY = (desiredBounds.max.y - desiredBounds.min.y) / maxDimension;
  var desiredSizeZ = (desiredBounds.max.z - desiredBounds.min.z) / maxDimension;
  for (var i in geometryVertices) {
    var vert = geometryVertices[i];
    vert.x = desiredBounds.min.x + (bounds.max.x - vert.x) * desiredSizeX;
    vert.y = desiredBounds.min.y + (bounds.max.y - vert.y) * desiredSizeY;
    vert.z = desiredBounds.min.z + (bounds.max.z - vert.z) * desiredSizeZ;
  }
};
