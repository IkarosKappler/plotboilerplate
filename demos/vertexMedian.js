/**
 * Computes the median of a set of vertices. This can be something like the center of a polygon or so.
 *
 * @author  Ikaros Kappler
 * @date    2024-10-02
 * @version 1.0.0
 */

(function (context) {
  /**
   * This function returns the median of a list of 2D vertices (or null if the list is empty or null)
   *
   * @param {XYCoords[]} vertexList
   * @returns Vertex | null
   */
  context.vertexMedian = function (vertexList) {
    if (vertexList == null || vertexList.length == 0) {
      return null;
    }
    var result = new Vertex(vertexList[0]);
    for (var i = 1; i < vertexList.length; i++) {
      result.add(vertexList[i]);
    }
    result.multiplyScalar(1 / vertexList.length);
    return result;
  };
})(globalThis);
