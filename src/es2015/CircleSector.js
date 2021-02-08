/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @version  1.1.0
 **/
import { UIDGenerator } from "./UIDGenerator";
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
export class CircleSector {
    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    constructor(circle, startAngle, endAngle) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "CircleSector";
        this.uid = UIDGenerator.next();
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
    toSVGString(options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path ');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        const data = CircleSector.circleSectorUtils.describeSVGArc(this.circle.center.x, this.circle.center.y, this.circle.radius, this.startAngle, this.endAngle);
        buffer.push(' d="' + data.join(" ") + '" />');
        return buffer.join('');
    }
    ;
} // END class
CircleSector.circleSectorUtils = {
    /**
     * Helper function to convert polar circle coordinates to cartesian coordinates.
     *
     * TODO: generalize for ellipses (two radii).
     *
     * @param {number} angle - The angle in radians.
    */
    polarToCartesian: (centerX, centerY, radius, angle) => {
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
    describeSVGArc: (x, y, radius, startAngle, endAngle, options) => {
        if (typeof options === 'undefined')
            options = { moveToStart: true };
        const end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
        const start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
        // Split full circles into two halves.
        // Some browsers have problems to render full circles (described by start==end).
        if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
            const firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
            const firstEndPoint = { x: firstHalf[firstHalf.length - 2],
                y: firstHalf[firstHalf.length - 1]
            };
            const secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
            return firstHalf.concat(secondHalf);
        }
        // Boolean stored as integers (0|1).
        const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
        const sweepFlag = 1;
        const pathData = [];
        if (options.moveToStart) {
            pathData.push('M', start.x, start.y);
        }
        pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
        return pathData;
    }
};
//# sourceMappingURL=CircleSector.js.map