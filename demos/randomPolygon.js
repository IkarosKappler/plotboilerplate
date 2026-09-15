// +---------------------------------------------------------------------------------
// | Generate a random polygon
// |
// | @date     2026-09-15
// +-------------------------------
var randomPolygon = function (viewport, pointCount) {
  var radius = viewport.getMinDimension() / 2.0;
  var center = viewport.getCenter();
  var points = [];
  for (var i = 0; i < pointCount; i++) {
    var point = new Vertex(radius * 0.1 + Math.random() * 0.9 * radius, 0.0);
    point.rotate((Math.PI / pointCount) * 2 * i, center);
    points.push(point);
  }
  return new Polygon(points, false);
};
