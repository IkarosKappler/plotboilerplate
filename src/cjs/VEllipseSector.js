"use strict";
/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author  Ikaros Kappler
 * @date    2021-02-26
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipseSector = void 0;
var CubicBezierCurve_1 = require("./CubicBezierCurve");
var geomutils_1 = require("./geomutils");
var Line_1 = require("./Line");
var UIDGenerator_1 = require("./UIDGenerator");
var VEllipse_1 = require("./VEllipse");
var Vertex_1 = require("./Vertex");
/**
 * @classdesc A class for elliptic sectors.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
var VEllipseSector = /** @class */ (function () {
    /**
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise, and that start and end angle
     * will be wrapped to [0,PI*2).
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    function VEllipseSector(ellipse, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipseSector";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.ellipse = ellipse;
        this.startAngle = geomutils_1.geomutils.wrapMinMax(startAngle, 0, Math.PI * 2);
        this.endAngle = geomutils_1.geomutils.wrapMinMax(endAngle, 0, Math.PI * 2);
    }
    /**
     * Convert this elliptic sector into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing the elliptic sector.
     */
    VEllipseSector.prototype.toCubicBezier = function (quarterSegmentCount, threshold) {
        // There are at least 4 segments required (dour quarters) to approximate a whole
        // ellipse with Bézier curves.
        // A visually 'good' approximation should have 12; this seems to be a good value (anything multiple of 4).
        var segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        var radiusH = this.ellipse.radiusH();
        var radiusV = this.ellipse.radiusV();
        var startAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.startAngle);
        var endAngle = VEllipseSector.ellipseSectorUtils.normalizeAngle(this.endAngle);
        // Find all angles inside start and end
        var angles = VEllipseSector.ellipseSectorUtils.equidistantVertAngles(radiusH, radiusV, startAngle, endAngle, segmentCount);
        angles = [startAngle].concat(angles).concat([endAngle]);
        var curves = [];
        var curAngle = angles[0];
        var startPoint = this.ellipse.vertAt(curAngle);
        for (var i = 0; i + 1 < angles.length; i++) {
            var nextAngle = angles[(i + 1) % angles.length];
            var endPoint = this.ellipse.vertAt(nextAngle);
            var startTangent = this.ellipse.tangentAt(curAngle);
            var endTangent = this.ellipse.tangentAt(nextAngle);
            // Distorted ellipses can only be approximated by linear Bézier segments
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                var diff = startPoint.difference(endPoint);
                var curve = new CubicBezierCurve_1.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                // Find intersection
                var intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                var startDiff = startPoint.difference(intersection);
                var endDiff = endPoint.difference(intersection);
                var curve = new CubicBezierCurve_1.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                curves.push(curve);
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    };
    VEllipseSector.ellipseSectorUtils = {
        /**
         * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
         * Inspiration found at:
         *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: function (x, y, radiusH, radiusV, startAngle, endAngle, rotation, options) {
            if (typeof options === "undefined")
                options = { moveToStart: true };
            if (typeof rotation === "undefined")
                rotation = 0.0;
            // Important note: this function only works if start- and end-angle are within
            // one whole circle [x,x+2*PI].
            // Revelations of more than 2*PI might result in unexpected arcs.
            // -> Use the geomutils.wrapMax( angle, 2*PI )
            startAngle = geomutils_1.geomutils.wrapMax(startAngle, Math.PI * 2);
            endAngle = geomutils_1.geomutils.wrapMax(endAngle, Math.PI * 2);
            // Find the start- and end-point on the rotated ellipse
            // XYCoords to Vertex (for rotation)
            var end = new Vertex_1.Vertex(VEllipse_1.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, endAngle));
            var start = new Vertex_1.Vertex(VEllipse_1.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, startAngle));
            end.rotate(rotation, { x: x, y: y });
            start.rotate(rotation, { x: x, y: y });
            // Boolean stored as integers (0|1).
            var diff = endAngle - startAngle;
            var largeArcFlag;
            if (diff < 0) {
                largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
            }
            else {
                largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
            }
            var sweepFlag = 1;
            var pathData = [];
            if (options.moveToStart) {
                pathData.push("M", start.x, start.y);
            }
            // Arc rotation in degrees, not radians.
            var r2d = 180 / Math.PI;
            pathData.push("A", radiusH, radiusV, rotation * r2d, largeArcFlag, sweepFlag, end.x, end.y);
            return pathData;
        },
        /**
         * Helper function to find second-kind elliptic angles, so that the euclidean distance along the the
         * elliptic sector is the same for all.
         *
         * Note that this is based on the full ellipse calculuation and start and end will be cropped; so the
         * distance from the start angle to the first angle and/or the distance from the last angle to
         * the end angle may be different to the others.
         *
         * Furthermore the computation is only possible on un-rotated ellipses; if your source ellipse has
         * a rotation on the plane please 'rotate' the result angles afterwards to find matching angles.
         *
         * Returned angles are normalized to the interval `[ 0, PI*2 ]`.
         *
         * @param {number} radiusH - The first (horizonal) radius of the ellipse.
         * @param {number} radiusV - The second (vertical) radius of the ellipse.
         * @param {number} startAngle - The opening angle of your elliptic sector (please use normalized angles).
         * @param {number} endAngle - The closing angle of your elliptic sector (please use normalized angles).
         * @param {number} fullEllipsePointCount - The number of base segments to use from the source ellipse (12 or 16 are good numbers).
         * @return {Array<number>} An array of n angles inside startAngle and endAngle (where n <= fullEllipsePointCount).
         */
        equidistantVertAngles: function (radiusH, radiusV, startAngle, endAngle, fullEllipsePointCount) {
            var ellipseAngles = VEllipse_1.VEllipse.utils.equidistantVertAngles(radiusH, radiusV, fullEllipsePointCount);
            ellipseAngles = ellipseAngles.map(function (angle) { return VEllipseSector.ellipseSectorUtils.normalizeAngle(angle); });
            var angleIsInRange = function (angle) {
                if (startAngle < endAngle)
                    return angle >= startAngle && angle <= endAngle;
                else
                    return angle >= startAngle || (angle <= endAngle && angle >= 0);
            };
            // Drop all angles outside the sector
            var ellipseAngles = ellipseAngles.filter(angleIsInRange);
            // Now we need to sort the angles to the first one in the array is the closest to startAngle.
            // --> find the angle that is closest to the start angle
            var startIndex = VEllipseSector.ellipseSectorUtils.findClosestToStartAngle(startAngle, endAngle, ellipseAngles);
            // Bring all angles into the correct order
            //    Idea: use splice or slice here?
            var angles = [];
            for (var i = 0; i < ellipseAngles.length; i++) {
                angles.push(ellipseAngles[(startIndex + i) % ellipseAngles.length]);
            }
            return angles;
        },
        findClosestToStartAngle: function (startAngle, endAngle, ellipseAngles) {
            // Note: endAngle > 0 && startAngle > 0
            if (startAngle > endAngle) {
                var n = ellipseAngles.length;
                for (var i = 0; i < n; i++) {
                    var ea = geomutils_1.geomutils.wrapMinMax(ellipseAngles[i], 0, Math.PI * 2);
                    if (ea >= startAngle && ea >= endAngle) {
                        return i;
                    }
                }
            }
            return 0;
        },
        normalizeAngle: function (angle) { return (angle < 0 ? Math.PI * 2 + angle : angle); },
        /**
         * Convert the elliptic arc from endpoint parameters to center parameters as described
         * in the w3c svg arc implementation note.
         *
         * https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
         *
         * @param {number} x1 - The x component of the start point (end of last SVG command).
         * @param {number} y1 - The y component of the start point (end of last SVG command).
         * @param {number} rx - The first (horizontal) radius of the ellipse.
         * @param {number} ry - The second (vertical) radius of the ellipse.
         * @param {number} phi - The ellipse's rotational angle (angle of axis rotation) in radians (not in degrees as the SVG command uses!)
         * @param {boolean} fa - The large-arc-flag (boolean, not 0 or 1).
         * @param {boolean} fs - The sweep-flag (boolean, not 0 or 1).
         * @param {number} x2 - The x component of the end point (end of last SVG command).
         * @param {number} y2 - The y component of the end point (end of last SVG command).
         * @returns
         */
        endpointToCenterParameters: function (x1, y1, rx, ry, phi, fa, fs, x2, y2) {
            // console.log("endpointToCenterParameters", x1, y1, phi, rx, ry, fa, fs, x2, y2);
            // Thanks to
            //    https://observablehq.com/@toja/ellipse-and-elliptical-arc-conversion
            var abs = Math.abs;
            var sin = Math.sin;
            var cos = Math.cos;
            var sqrt = Math.sqrt;
            var pow = function (n) {
                return n * n;
            };
            var sinphi = sin(phi);
            var cosphi = cos(phi);
            // Step 1: simplify through translation/rotation
            var x = (cosphi * (x1 - x2)) / 2 + (sinphi * (y1 - y2)) / 2;
            var y = (-sinphi * (x1 - x2)) / 2 + (cosphi * (y1 - y2)) / 2;
            var px = pow(x), py = pow(y), prx = pow(rx), pry = pow(ry);
            // correct of out-of-range radii
            var L = px / prx + py / pry;
            if (L > 1) {
                rx = sqrt(L) * abs(rx);
                ry = sqrt(L) * abs(ry);
            }
            else {
                rx = abs(rx);
                ry = abs(ry);
            }
            // Step 2 + 3: compute center
            var sign = fa === fs ? -1 : 1;
            var M = sqrt((prx * pry - prx * py - pry * px) / (prx * py + pry * px)) * sign;
            var _cx = (M * (rx * y)) / ry;
            var _cy = (M * (-ry * x)) / rx;
            var cx = cosphi * _cx - sinphi * _cy + (x1 + x2) / 2;
            var cy = sinphi * _cx + cosphi * _cy + (y1 + y2) / 2;
            // Step 4: Compute start and end angle
            var center = new Vertex_1.Vertex(cx, cy);
            var axis = center.clone().addXY(rx, ry);
            var ellipse = new VEllipse_1.VEllipse(center, axis, 0);
            ellipse.rotate(phi);
            var startAngle = new Line_1.Line(ellipse.center, new Vertex_1.Vertex(x1, y1)).angle();
            var endAngle = new Line_1.Line(ellipse.center, new Vertex_1.Vertex(x2, y2)).angle();
            return new VEllipseSector(ellipse, startAngle - phi, endAngle - phi);
        }
    }; // END ellipseSectorUtils
    return VEllipseSector;
}());
exports.VEllipseSector = VEllipseSector;
//# sourceMappingURL=VEllipseSector.js.map