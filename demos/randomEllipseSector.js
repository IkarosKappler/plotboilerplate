// +---------------------------------------------------------------------------------
// | Generate a random ellipse sector.
// |
// | @date     2025-04-02
// +-------------------------------
var randomEllipseSector = function (viewport) {
  var center = viewport.randomPoint(0.35, 0.35);
  var radiusH = (Math.random() * Math.min(viewport.width, viewport.height)) / 5;
  var radiusV = (Math.random() * Math.min(viewport.width, viewport.height)) / 5;
  var rotation = Math.random() * Math.PI * 2;

  // Create the ellipse
  var ellipse = new VEllipse(center, new Vertex(center.x + radiusH, center.y + radiusV), rotation);

  // Now create a sector from the ellipse
  var startAngle = Math.random() * Math.PI; // (12 / 180) * Math.PI;
  var endAngle = startAngle + Math.PI / 2.0 + Math.random() * Math.PI; // (89 / 180) * Math.PI;
  var sector = new VEllipseSector(ellipse, startAngle, endAngle);

  return sector;
};
