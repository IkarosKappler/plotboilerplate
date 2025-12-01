/**
 * A simple 3d bounds object.
 *
 * @require Vert3
 *
 * @date 2025-11-26
 * @author Ika
 */

// TODO: integrate into GeometryMesh.ts ?

(function (_context) {
  /**
   *
   * @param {Vert3} min3
   * @param {Vert3} max3
   */
  var Bounds3 = function (min3, max3) {
    this.min = min3;
    this.max = max3;
    this.width = max3.x - min3.x;
    this.height = max3.y - min3.y;
    this.depth = max3.z - min3.z;
  };

  _context.Bounds3 = Bounds3;
})(globalThis);
