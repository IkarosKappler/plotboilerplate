"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2019-02-03
 * @modified 2021-03-01 Added `wrapMax` function.
 * @modified 2024-11-15 Adding helper function `geomutils.mapAngleTo2PI(number)` for mapping any value into the interval [0,2*PI).
 * @modified 2024-11-22 Adding helper function `geomutils.dotProduct(number)` for calculating the dot product of two vertices (as vectors).
 *
 * @version  1.2.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.geomutils = void 0;
var Line_1 = require("./Line");
var Triangle_1 = require("./Triangle");
/**
 * A collection of usefull geometry utilities.
 *
 * @global
 **/
exports.geomutils = {
    /**
     * Map any angle (any numeric value) to [0, Math.PI).
     *
     * @param {number} angle - The numeric value to map.
     * @return {number} The mapped angle inside [0,PI*2].
     **/
    mapAngleTo2PI: function (angle) {
        // Source: https://forums.codeguru.com/showthread.php?384172-get-angle-into-range-0-2*pi
        var new_angle = Math.asin(Math.sin(angle));
        if (Math.cos(angle) < 0) {
            return Math.PI - new_angle;
        }
        else if (new_angle < 0) {
            return new_angle + 2 * Math.PI;
        }
        else {
            return new_angle;
        }
    },
    /**
     * Map any angle (any numeric value) to [0, Math.PI).
     *
     * A × B := (A.x * B.x) + (A.y * B.y)
     *
     * @param {XYCoords} vertA - The first vertex.
     * @param {XYCoords} vertB - The second vertex.
     * @return {number} The dot product of the two vertices.
     **/
    dotProduct: function (vertA, vertB) {
        return vertA.x * vertB.x + vertA.y * vertB.y;
    },
    /**
     * Compute the n-section of the angle – described as a triangle (A,B,C) – in point A.
     *
     * @param {Vertex} pA - The first triangle point.
     * @param {Vertex} pB - The second triangle point.
     * @param {Vertex} pC - The third triangle point.
     * @param {number} n - The number of desired angle sections (example: 2 means the angle will be divided into two sections,
     *                      means an returned array with length 1, the middle line).
     *
     * @return {Line[]} An array of n-1 lines secting the given angle in point A into n equal sized angle sections. The lines' first vertex is A.
     */
    nsectAngle: function (pA, pB, pC, n) {
        var triangle = new Triangle_1.Triangle(pA, pB, pC);
        var lineAB = new Line_1.Line(pA, pB);
        var lineAC = new Line_1.Line(pA, pC);
        // Compute the difference; this is the angle between AB and AC
        var insideAngle = lineAB.angle(lineAC);
        // We want the inner angles of the triangle, not the outer angle;
        //   which one is which depends on the triangle 'direction'
        var clockwise = triangle.determinant() > 0;
        // For convenience convert the angle [-PI,PI] to [0,2*PI]
        if (insideAngle < 0)
            insideAngle = 2 * Math.PI + insideAngle;
        if (!clockwise)
            insideAngle = (2 * Math.PI - insideAngle) * -1;
        // Scale the rotated lines to the max leg length (looks better)
        var lineLength = Math.max(lineAB.length(), lineAC.length());
        var scaleFactor = lineLength / lineAB.length();
        var result = [];
        for (var i = 1; i < n; i++) {
            // Compute the i-th inner sector line
            result.push(new Line_1.Line(pA, pB.clone().rotate(-i * (insideAngle / n), pA)).scale(scaleFactor));
        }
        return result;
    },
    /**
     * Wrap the value (e.g. an angle) into the given range of [0,max).
     *
     * @name wrapMax
     * @param {number} x - The value to wrap.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [0,max).
     */
    wrapMax: function (x, max) {
        // Found at
        //    https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
        return (max + (x % max)) % max;
    },
    /**
     * Wrap the value (e.g. an angle) into the given range of [min,max).
     *
     * @name wrapMinMax
     * @param {number} x - The value to wrap.
     * @param {number} min - The min bound to use for the range.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [min,max).
     */
    // Currently un-used
    wrapMinMax: function (x, min, max) {
        return min + exports.geomutils.wrapMax(x - min, max - min);
    }
};
//# sourceMappingURL=geomutils.js.map