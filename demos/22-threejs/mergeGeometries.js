/**
 * @require locateVertexInArray
 *
 * @author  Ikaros Kappler
 * @date    2021-07-26
 * @version 0.0.1
 */

(function (_context) {
  var EPS = 0.000001;

  /**
   * This function tries to merge the 'mergeGeometry' into the 'baseGeometry'.
   * It assumes that both geometries are somehow connected, so it will try to
   * local equal vertices first instead of just copying all 'mergeGeometry' vertices
   * into the other one.
   *
   * The merged vertices will be cloned.
   *
   * @param {THREE.Geometry} baseGeometry
   * @param {THREE.Geometry} mergeGeometry
   */
  var mergeGemoetries = function (baseGeometry, mergeGeometry, epsilon) {
    if (typeof epsilon === "undefined") {
      epsilon = EPS;
    }
    var vertexMap = mergeAndMapVertices(baseGeometry, mergeGeometry, epsilon);
  };

  var mergeAndMapVertices = function (baseGeometry, mergeGeometry, epsilon) {
    var vertexMap = []; // Array<number>
    for (var v = 0; v < mergeGeometry.vertices.length; v++) {
      var mergeVert = mergeGeometry.vertices[v];
      var indexInBase = locateVertexInArray(baseGeometry, mergeVert);
      if (indexInBase === -1) {
        // The current vertex cannot be found in the base geometry.
        //  -> add to geometry and remember new index.
        vertexMap.push(baseGeometry.vertices.length);
        baseGeometry.vertices.push(mergeVert.clone());
      } else {
        vertexMap.push(indexInBase);
      }
    }
    return vertexMap;
  };

  _context.mergeGemoetries = mergeGemoetries;
})(globalThis);
