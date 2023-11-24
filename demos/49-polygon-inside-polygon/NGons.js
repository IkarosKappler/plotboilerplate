/**
 * Generate regular polygons (N-Gons).
 *
 * @author  Ikaros Kappler
 * @date    2023-11-24
 * @version 1.0.0
 */

(function (_context) {
  var NGons = {};

  NGons.ngon = function (n, radius) {
    var verts = [];
    for (var i = 0; i < n; i++) {
      var vert = new Vertex(radius, 0);
      vert.rotate(((Math.PI * 2) / n) * i);
      verts.push(vert);
    }
    return new Polygon(verts);
  };

  NGons.nstar = function (n, radiusA, radiusB) {
    var verts = [];
    for (var i = 0; i < n; i++) {
      var vert = new Vertex(i % 2 === 0 ? radiusA : radiusB, 0);
      vert.rotate(((Math.PI * 2) / n) * i);
      verts.push(vert);
    }
    return new Polygon(verts);
  };

  _context.NGons = NGons;
})(globalThis);
