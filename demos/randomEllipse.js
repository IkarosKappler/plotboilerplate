// +---------------------------------------------------------------------------------
// | Generate a random ellipse sector.
// |
// | @date     2026-10-30
// +-------------------------------
var randomEllipse = function (viewport) {
  var center = viewport.randomPoint(0.35, 0.35);
  var radiusH = (Math.random() * Math.min(viewport.width, viewport.height)) / 5;
  var radiusV = (Math.random() * Math.min(viewport.width, viewport.height)) / 5;
  var rotation = Math.random() * Math.PI * 2;

  // Create the ellipse
  var ellipse = new VEllipse(center, new Vertex(center.x + radiusH, center.y + radiusV), rotation);

  return ellipse;
};
