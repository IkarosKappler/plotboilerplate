/**
 * @date 2024-09-10 (put to a single file)
 */

// +---------------------------------------------------------------------------------
// | A helper function for drawing polygon numbers to each detected path point.
// +-------------------------------
globalThis.drawPolygonIndices = function (polygon, fill, options) {
  // console.log("poly[i].vertices.length", poly.vertices.length);
  for (var j = 0; j < polygon.vertices.length; j++) {
    // const coords = convertCoords2Pos(polygon.vertices[j].x, polygon.vertices[j].y);
    fill.text(
      "" + j,
      polygon.vertices[j].x + 5,
      polygon.vertices[j].y,
      options ?? { color: "orange", fontFamily: "Arial", fontSize: 9 }
    );
  }
};
