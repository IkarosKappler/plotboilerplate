// +---------------------------------------------------------------------------------
// | Generate a random circle inside the viewport.
// |
// | @date     2026-06-04
// +-------------------------------
var randomCircle = function (viewport) {
  // var vp = pb.viewport();
  var radius = 2 + Math.random() * viewport.getMinDimension() * 0.2;
  var center = viewport.randomPoint(radius, radius);
  var circle = new Circle(center, radius);
  return circle;
};
