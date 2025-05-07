// +---------------------------------------------------------------------------------
// | Generate a random circle sector.
// |
// | @date     2024-03-08
// | @modified 2025-04-02 Stored into sharable file.
// +-------------------------------
var randomCircleSector = function (viewport) {
  // var vp = pb.viewport();
  var circle = new Circle(viewport.randomPoint(0.35, 0.35), (Math.random() * Math.min(viewport.width, viewport.height)) / 5);
  var startAngle = Math.random() * Math.PI * 2;
  var endAngle = startAngle + Math.PI / 2.0 + Math.random() * Math.PI;
  return new CircleSector(circle, startAngle, endAngle);
};
