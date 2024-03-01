"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @modified 2024-01-30 Added a missing type in the `describeSVGArc` function.
 * @modified 2024-03-01 Added the `getStartPoint` and `getEndPoint` methods.
 * @version  1.2.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleSector = void 0;
var UIDGenerator_1 = require("./UIDGenerator");
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
var CircleSector = /** @class */ (function () {
    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    function CircleSector(circle, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "CircleSector";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.circle = circle;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    /**
     * Get the sectors starting point (on the underlying circle, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's stating point.
     */
    CircleSector.prototype.getStartPoint = function () {
        return this.circle.vertAt(this.startAngle);
    };
    /**
     * Get the sectors ending point (on the underlying circle, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's ending point.
     */
    CircleSector.prototype.getEndPoint = function () {
        return this.circle.vertAt(this.endAngle);
    };
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     *
     * @method destroy
     * @instance
     * @memberof CircleSector
     * @return {void}
     */
    CircleSector.prototype.destroy = function () {
        this.circle.destroy();
        this.isDestroyed = true;
    };
    CircleSector.circleSectorUtils = {
        /**
         * Helper function to convert polar circle coordinates to cartesian coordinates.
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {number} angle - The angle in radians.
         */
        polarToCartesian: function (centerX, centerY, radius, angle) {
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        },
        /**
         * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
         * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: function (x, y, radius, startAngle, endAngle, options) {
            if (typeof options === "undefined")
                options = { moveToStart: true };
            var end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
            var start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
            // Split full circles into two halves.
            // Some browsers have problems to render full circles (described by start==end).
            if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
                var firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
                var secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
                return firstHalf.concat(secondHalf);
            }
            // Boolean stored as integers (0|1).
            var diff = endAngle - startAngle;
            var largeArcFlag;
            var sweepFlag;
            if (diff < 0) {
                largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
                sweepFlag = 1;
            }
            else {
                largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
                sweepFlag = 1;
            }
            var pathData = [];
            if (options.moveToStart) {
                pathData.push("M", start.x, start.y);
            }
            pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
            return pathData;
        }
    };
    return CircleSector;
}()); // END class
exports.CircleSector = CircleSector;
//# sourceMappingURL=CircleSector.js.map