// +---------------------------------------------------------------------------------
// | Generate a random polygon
// |
// | @date     2026-09-15
// +-------------------------------
var randomPolygon = function (viewport, pointCount, isClockwise) {
  var radius = viewport.getMinDimension() / 2.0;
  var center = viewport.getCenter();
  var points = [];
  var directionFactor = isClockwise ? -1 : 1;
  for (var i = 0; i < pointCount; i++) {
    var point = new Vertex(radius * 0.1 + Math.random() * 0.9 * radius, 0.0);
    point.rotate(directionFactor * (Math.PI / pointCount) * 2 * i, center);
    points.push(point);
  }
  return new Polygon(points, false);
};
