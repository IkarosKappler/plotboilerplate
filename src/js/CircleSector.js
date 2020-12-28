"use strict";
/**
 * @author   Ikaros Kappler
 * @version  1.0.0
 * @date     2020-12-17
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleSector = void 0;
// [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
// export type SVGArcPathParams = [ string, number, number, number, number, number, number, number ];
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
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
        this.circle = circle;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
    ;
    /**
      * Create an SVG representation of this circle.
      *
      * @method toSVGString
      * @param {object=} options - An optional set of options, like 'className'.
      * @return {string} A string representing the SVG code for this vertex.
      * @instance
      * @memberof Circle
      */
    CircleSector.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path ');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        var data = CircleSector.circleSectorUtils.describeSVGArc(this.circle.center.x, this.circle.center.y, this.circle.radius, this.startAngle, this.endAngle);
        buffer.push(' d="' + data.join(" ") + '" />');
        return buffer.join('');
    };
    ;
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
                x: centerX + (radius * Math.cos(angle)),
                y: centerY + (radius * Math.sin(angle))
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
            if (typeof options === 'undefined')
                options = { moveToStart: true };
            var end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
            var start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
            // Split full circles into two halves.
            // Some browsers have problems to render full circles (described by start==end).
            if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
                var firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
                var firstEndPoint = { x: firstHalf[firstHalf.length - 2],
                    y: firstHalf[firstHalf.length - 1]
                };
                var secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
                return firstHalf.concat(secondHalf);
            }
            // Boolean stored as integers (0|1).
            var largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
            var sweepFlag = 1;
            var pathData = [];
            if (options.moveToStart) {
                pathData.push('M', start.x, start.y);
            }
            pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
            return pathData;
        }
    };
    return CircleSector;
}()); // END class
exports.CircleSector = CircleSector;
//# sourceMappingURL=CircleSector.js.map