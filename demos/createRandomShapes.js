/**
 * A helper function to create randomized instances of all available shapes.
 *
 * @author   Ikaros Kappler
 * @date     2025-03-24 (first used in the demo 58-shape-reflecting-rays).
 * @modified 2025-05-05 Put into a separated file.
 * @require  createRandomizedPolygon, randomCircleSector, randomEllipseSector, BezierPathInteractionHelper, VEllipseHelper, VEllipseSectorHelper
 * @version  1.0.0
 */

// +---------------------------------------------------------------------------------
// | @param {PlotBoilerplate} pb
// | @param {Bounds} viewport
// | @return { shapes: Array<Polygon | Circle | VEllipse | CircleSector | VEllipseSector | BezierPath | Line | Triangle>,
// |           helpers: Array<Helper>,
// |           helperPoints: Array<Vertex>
// | }
// +-------------------------------
globalThis.createRandomShapes = function (pb, viewport) {
  // Create a new randomized polygon.
  var polygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
  polygon.scale(0.3, polygon.getCentroid());

  var line = new Line(viewport.randomPoint(), viewport.randomPoint());

  var triangle = new Triangle(viewport.randomPoint(), viewport.randomPoint(), viewport.randomPoint());
  // TODO: add triangle helper class

  // Create circle and ellpise
  var circle = new Circle(new Vertex(-25, -15), 90.0);
  var ellipse = new VEllipse(new Vertex(25, 15), new Vertex(150, 200), -Math.PI * 0.3);
  var circleSector = randomCircleSector(viewport);
  var ellipseSector = randomEllipseSector(viewport);

  // Create a new randomized Bézier curve.
  var tmpPolygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
  tmpPolygon.scale(0.3, polygon.getCentroid());
  var bezierPath = BezierPath.fromCurve(
    new CubicBezierCurve(tmpPolygon.vertices[0], tmpPolygon.vertices[1], tmpPolygon.vertices[2], tmpPolygon.vertices[3])
  );
  bezierHelper = new BezierPathInteractionHelper(pb, [bezierPath]);

  shapes = [polygon, circle, ellipse, circleSector, ellipseSector, bezierPath, line, triangle];
  // Align all shapes on a circle :)
  var alignCircle = new Circle(new Vertex(), viewport.getMinDimension() * 0.333);
  shapes.forEach(function (shape, i) {
    var newPosition = alignCircle.vertAt((i * Math.PI * 2) / shapes.length);
    // console.log("shape ", i, typeof shape);
    shape.move(newPosition);
  });

  var triangleHelper = new TriangleHelper(triangle, true);

  var circleRadiusPoint = circle.vertAt(0.0);
  var circleHelper = new CircleHelper(circle, circleRadiusPoint);

  // We want to change the ellipse's radii and rotation by dragging points around
  var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
  var ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);

  // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
  var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
  var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
  var cicleSectorHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, pb);

  // We want to change the ellipse's radii and rotation by dragging points around
  var startControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.startAngle);
  var endControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.endAngle);
  var rotationControlPoint = ellipseSector.ellipse
    .vertAt(0) // ellipseSector.ellipse.rotation)
    .scale(1.2, ellipseSector.ellipse.center);
  var ellipseSectorHelper = new VEllipseSectorHelper(ellipseSector, startControlPoint, endControlPoint, rotationControlPoint);

  return {
    shapes: shapes,
    helpers: [bezierHelper, ellipseHelper, cicleSectorHelper, ellipseSectorHelper, circleHelper, triangleHelper],
    helperPoints: [
      circleRadiusPoint,
      ellipseRotationControlPoint,
      controlPointA,
      controlPointB,
      startControlPoint,
      endControlPoint,
      rotationControlPoint
    ]
  };
};
