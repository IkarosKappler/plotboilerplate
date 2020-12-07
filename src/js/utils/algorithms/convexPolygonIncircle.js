"use strict";
/**
 * @author  mbostock, extended and ported to TypeScript by Ikaros Kappler
 * @date    2020-05-19
 * @version 1.0.1
 * @file    contextPolygonIncircle
 * @public
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convexPolygonIncircle = void 0;
var Circle_1 = require("../../Circle");
var geomutils_1 = require("../../geomutils");
var Line_1 = require("../../Line");
var Triangle_1 = require("../../Triangle");
/**
 * For circle-polygon-intersection-count detection we need an epsilon to
 * eliminate smaller precision errors.
 */
var EPS = 0.000001;
;
/**
 * Compute the max sized inlying circle in the given convex (!) polygon - also called the
 * convex-polygon incircle.
 *
 * The function will return an object with either: the circle, and the triangle that defines
 * the three tangent points where the circle touches the polygon.
 *
 * Inspired by
 *  https://observablehq.com/@mbostock/convex-polygon-incircle
 *  https://observablehq.com/@mbostock/circle-tangent-to-three-lines
 *
 *
 * @requires Circle
 * @requires Line
 * @requires Vertex
 * @requires Triangle
 * @requires nsectAngle
 * @requires geomutils
 *
 * @global
 * @name convexPolygonIncircle
 * @param {Polygon} convexHull - The actual convex polygon.
 * @return {PolygonIncircle} A pair of a circle (the incircle) and a triangle (the three points where the circle is touching the polygon).
 */
var convexPolygonIncircle = function (convexHull) {
    var n = convexHull.vertices.length;
    var bestCircle = undefined;
    var bestTriangle = undefined;
    for (var a = 0; a < n; a++) {
        for (var b = a + 1; b < n; b++) {
            for (var c = b + 1; c < n; c++) {
                // As these lines are part of the convex hull, we know that
                //  * line a preceeds line b and
                //  * line b preceeds line c :)
                var lineA = new Line_1.Line(convexHull.vertices[a], convexHull.vertices[(a + 1) % n]);
                var lineB = new Line_1.Line(convexHull.vertices[b], convexHull.vertices[(b + 1) % n]);
                var lineC = new Line_1.Line(convexHull.vertices[c], convexHull.vertices[(c + 1) % n]);
                // Find intersections by expanding the lines
                var vertB = lineA.intersection(lineB);
                var vertC = lineB.intersection(lineC);
                // An object: { center: Vertex, radius: number }
                var triangle = getTangentTriangle4(lineA.a, vertB, vertC, lineC.b);
                // Workaround. There will be a future version where the 'getCircumCircle()' functions
                // returns a real Circle instance.
                var _circle = triangle.getCircumcircle();
                var circle = new Circle_1.Circle(_circle.center, _circle.radius);
                // Count the number of intersections with the convex hull:
                // If there are exactly three, we have found an in-lying circle.
                //  * Check if this one is better (bigger) than the old one.
                //  * Also check if the circle is located inside the polygon;
                //    The construction can, in some cases, produce an out-lying circle.
                if (!convexHull.containsVert(circle.center)) {
                    continue;
                }
                var circleIntersections = findCircleIntersections(convexHull, circle);
                if (circleIntersections.length == 3 && (bestCircle == undefined || bestCircle.radius < circle.radius)) {
                    bestCircle = circle;
                    bestTriangle = triangle;
                }
            }
        }
    }
    return { circle: bestCircle,
        triangle: bestTriangle };
};
exports.convexPolygonIncircle = convexPolygonIncircle;
/**
 * This function computes the three points for the inner maximum circle
 * lying tangential to the three subsequential lines (given by four points).
 *
 * Compute the circle from that triangle by using Triangle.getCircumcircle().
 *
 * Not all three lines should be parallel, otherwise the circle might have infinite radius.
 *
 * LineA := [vertA, vertB]
 * LineB := [vertB, vertC]
 * LineC := [vertC, vertD]
 *
 * @param {Vertex} vertA - The first point of the three connected lines.
 * @param {Vertex} vertB - The second point of the three connected lines.
 * @param {Vertex} vertC - The third point of the three connected lines.
 * @param {Vertex} vertD - The fourth point of the three connected lines.
 * @return {Triangle} The triangle of the circular tangential points with the given lines (3 or 4 of them).
 */
var getTangentTriangle4 = function (vertA, vertB, vertC, vertD) {
    var lineA = new Line_1.Line(vertA, vertB);
    var lineB = new Line_1.Line(vertB, vertC);
    var lineC = new Line_1.Line(vertC, vertD);
    var bisector1 = geomutils_1.geomutils.nsectAngle(vertB, vertA, vertC, 2)[0]; // bisector of first triangle
    var bisector2 = geomutils_1.geomutils.nsectAngle(vertC, vertB, vertD, 2)[0]; // bisector of second triangle
    var intersection = bisector1.intersection(bisector2);
    // Find the closest points on one of the polygon lines (all have same distance by construction)
    var circleIntersA = lineA.getClosestPoint(intersection);
    var circleIntersB = lineB.getClosestPoint(intersection);
    var circleIntersC = lineC.getClosestPoint(intersection);
    return new Triangle_1.Triangle(circleIntersA, circleIntersB, circleIntersC);
};
/**
 * Find all intersecting lines (indices) on the polyon that intersect the circle.
 *
 * @param {Polygon} convexHull - The polygon to detect the intersections on (here this is the convex hull given).
 * @param {Circle} circle - The circle to detect the intersections with.
 * @return {Array<number>} The indices of those lines that intersect (or touch) the circle.
 **/
var findCircleIntersections = function (convexHull, circle) {
    var result = [];
    for (var i = 0; i < convexHull.vertices.length; i++) {
        var line = new Line_1.Line(convexHull.vertices[i], convexHull.vertices[(i + 1) % convexHull.vertices.length]);
        // Use an epsilon here because circle coordinates can be kind of unprecise in the detail.
        if (circle.lineDistance(line) < EPS) {
            result.push(i);
        }
    }
    return result;
};
//# sourceMappingURL=convexPolygonIncircle.js.map