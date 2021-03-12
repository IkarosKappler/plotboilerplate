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
// TODO: add class to all demos
// TODO: add to PlotBoilerplate.add(...)
var CubicBezierCurve_1 = require("./CubicBezierCurve");
var geomutils_1 = require("./geomutils");
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
     * Note that the direction from start to end goes clockwise.
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
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    VEllipseSector.prototype.toCubicBezier = function (segmentCount, threshold) {
        segmentCount = Math.max(4, segmentCount || 12); // At least 4, but 12 seems to be a good value.
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        var radiusH = this.ellipse.radiusH();
        var radiusV = this.ellipse.radiusV();
        // var mapAngle = angle => (angle < 0 ? Math.PI * 2 + angle : angle);
        // var self = this;
        var startAngle = this.startAngle; // mapAngle(this.startAngle); // this.startAngle; // < 0 ? Math.PI * 2 + this.startAngle : this.startAngle;
        var endAngle = this.endAngle; // mapAngle(this.endAngle); // this.endAngle; // < 0 ? Math.PI * 2 + this.endAngle : this.endAngle;
        var angleIsInRange = function (angle) {
            // angle = mapAngle(angle);
            console.log("isInside(", startAngle, "<", angle, "<", endAngle, ")", angle >= startAngle && angle <= endAngle ? "true" : "FALSE");
            // return angle >= startAngle && angle <= endAngle;
            // angle = mapAngle(angle);
            if (startAngle < endAngle)
                return angle >= startAngle && angle <= endAngle;
            else
                return !(angle >= startAngle && angle <= endAngle); //angle <= startAngle && angle >= endAngle;
            // else return angle > startAngle && angle < endAngle;
        };
        // Find all angles inside start and end
        var angles = VEllipse_1.VEllipse.utils.equidistantVertAngles(radiusH, radiusV, segmentCount);
        console.log("startAngle", this.startAngle, "endAngle", this.endAngle);
        console.log(angles);
        angles = angles.filter(angleIsInRange);
        angles = [this.startAngle].concat(angles).concat([this.endAngle]);
        // if (startAngle < endAngle) {
        //   angles = [this.startAngle].concat(angles).concat([this.endAngle]);
        // } else {
        //   angles = [this.endAngle].concat(angles).concat([this.startAngle]);
        // }
        console.log("Using angles", angles);
        var curves = [];
        var curAngle = angles[0];
        var startPoint = this.ellipse.vertAt(curAngle);
        //let lastIntersection: Vertex | undefined;
        // for (var i = 0; i < segmentCount; i++) {
        for (var i = 0; i + 1 < angles.length; i++) {
            // let nextAngle: number = ((Math.PI * 2) / segmentCount) * (i + 1);
            // let nextAngle: number = VEllipse.utils.phiToTheta(radiusH, radiusV, Math.PI / 2.0 + ((Math.PI * 2) / segmentCount) * i);
            // let curAngle: number = angles[i];
            var nextAngle = angles[(i + 1) % angles.length];
            var endPoint = this.ellipse.vertAt(nextAngle);
            var startTangent = this.ellipse.tangentAt(curAngle);
            var endTangent = this.ellipse.tangentAt(nextAngle);
            // Find intersection
            var intersection = startTangent.intersection(endTangent);
            // What if intersection is undefined?
            // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
            var startDiff = startPoint.difference(intersection);
            var endDiff = endPoint.difference(intersection);
            var curve = new CubicBezierCurve_1.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
            curves.push(curve);
            startPoint = endPoint;
            curAngle = nextAngle;
            //lastIntersection = intersection;
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
            var diff = endAngle - startAngle;
            // Boolean stored as integers (0|1).
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
        } // END function describeSVGArc
    }; // END ellipseSectorUtils
    return VEllipseSector;
}());
exports.VEllipseSector = VEllipseSector;
//# sourceMappingURL=VEllipseSector.js.map