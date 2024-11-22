/**
 * @date 2024-09-10 (put to a single file)
 * @modified 2024-11-22 Adding params `xOffset` and `yOffset`.
 */

// +---------------------------------------------------------------------------------
// | A helper function for drawing polygon numbers to each detected path point.
// | @paran {string} color - Example "orange"
// | @paran {string} fontFamily - Example "Arial"
// | @paran {number} fontSize - Example 9
// | @param {number} xOffset - Optional.
// | @param {number} yOffset - Optional.
// +-------------------------------
globalThis.drawPolygonIndices = function (polygon, fill, options) {
  // console.log("poly[i].vertices.length", poly.vertices.length);
  for (var j = 0; j < polygon.vertices.length; j++) {
    // const coords = convertCoords2Pos(polygon.vertices[j].x, polygon.vertices[j].y);
    fill.text(
      "" + j,
      polygon.vertices[j].x + 5 + (options && typeof options.xOffset === "number" ? options.xOffset : 0),
      polygon.vertices[j].y + (options && typeof options.yOffset === "number" ? options.yOffset : 0),
      options ?? { color: "orange", fontFamily: "Arial", fontSize: 9 }
    );
  }
};
