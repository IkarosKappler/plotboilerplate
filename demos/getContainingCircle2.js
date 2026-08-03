/**
 * Get the mininum enclosing circle for the given two circles.
 *
 * @date 2026-07-03
 */

// TODO: put this to Circle class?
var getContainingCircle2 = function (circleA, circleB) {
  if (circleA.containsCircle(circleB)) {
    return circleA;
  }
  if (circleB.containsCircle(circleA)) {
    return circleB;
  }
  var connectLine = new Vector(circleA.center, circleB.center);
  var intersectionLineA = circleA.lineIntersection(connectLine.a, connectLine.b);
  var intersectionLineB = circleB.lineIntersection(connectLine.a, connectLine.b);
  var farestPointOnLineA = circleB.center.findFarestPoint(intersectionLineA.a, intersectionLineA.b);
  var farestPointOnLineB = circleA.center.findFarestPoint(intersectionLineB.a, intersectionLineB.b);
  var totalDiagonalLine = new Line(farestPointOnLineA, farestPointOnLineB);
  var center = totalDiagonalLine.vertAt(0.5);
  return new Circle(center, totalDiagonalLine.length() / 2.0); // center.distance(totalDiagonalLine.a));
};
