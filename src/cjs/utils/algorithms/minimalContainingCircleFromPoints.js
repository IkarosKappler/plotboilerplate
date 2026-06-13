"use strict";
/**
 * Calculate the minimal containing circle from a set of points.
 *
 * The number of points must be at least 2. Otherwise the function returns null.
 *
 * Inspired by https://github.com/rowanwins/smallest-enclosing-circle.
 *
 * @param {XYCoords[]} points
 * @returns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimalContainingCircleFromPoints = void 0;
var Circle_1 = require("../../Circle");
var Triangle_1 = require("../../Triangle");
var VertTuple_1 = require("../../VertTuple");
var Vertex_1 = require("../../Vertex");
/**
 * Calculate the minimal containing circle from a set of points.
 *
 * The number of points must be at least 2. Otherwise the function returns null.
 *
 * @param {XYCoords[]} points
 * @returns {Circle | null} The minimal containing circle or null if the point count is lower than 2.
 */
var minimalContainingCircleFromPoints = function (points) {
    if (points.length <= 1) {
        return null;
    }
    var circleObject = wetzlsAlgorithm(points);
    return new Circle_1.Circle(new Vertex_1.Vertex(circleObject.center.x, circleObject.center.y), circleObject.radius);
};
exports.minimalContainingCircleFromPoints = minimalContainingCircleFromPoints;
/**
 * This initiates the actual algorithm but return a shallow circle representation.
 *
 * @param points
 * @returns
 */
var wetzlsAlgorithm = function (points) {
    return minimumContainingCircle(points, points.length, [], 0);
};
/**
 * Pre: points.length >= 2
 * @param {Vertex[]} points
 * @param n
 * @param boundary
 * @param boundaryLength
 * @returns
 */
var minimumContainingCircle = function (points, n, boundary, boundaryLength) {
    if (boundaryLength === 3) {
        return Triangle_1.Triangle.utils.calcCircumcircle(boundary[0], boundary[1], boundary[2]);
    }
    else if (n === 1 && boundaryLength === 0) {
        return { center: { x: points[0].x, y: points[0].y }, radius: 0 };
    }
    else if (n === 0 && boundaryLength === 2) {
        return VertTuple_1.VertTuple.vtutils.calcCircumcircle(boundary[0], boundary[1]);
    }
    else if (n === 1 && boundaryLength === 1) {
        return VertTuple_1.VertTuple.vtutils.calcCircumcircle(boundary[0], points[0]);
    }
    else {
        var localCircle = minimumContainingCircle(points, n - 1, boundary, boundaryLength);
        if (!Circle_1.Circle.circleUtils.containsPoint(localCircle.center, localCircle.radius, points[n - 1])) {
            boundary[boundaryLength++] = points[n - 1];
            return minimumContainingCircle(points, n - 1, boundary, boundaryLength);
        }
        return localCircle;
    }
};
//# sourceMappingURL=minimalContainingCircleFromPoints.js.map