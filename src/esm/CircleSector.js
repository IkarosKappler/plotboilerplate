/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @modified 2024-01-30 Added a missing type in the `describeSVGArc` function.
 * @modified 2024-03-01 Added the `getStartPoint` and `getEndPoint` methods.
 * @version  1.2.0
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
    /**
     * Get the sectors starting point (on the underlying circle, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's stating point.
     */
    getStartPoint() {
        return this.circle.vertAt(this.startAngle);
    }
    /**
     * Get the sectors ending point (on the underlying circle, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's ending point.
     */
    getEndPoint() {
        return this.circle.vertAt(this.endAngle);
    }
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
    destroy() {
        this.circle.destroy();
        this.isDestroyed = true;
    }
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
    describeSVGArc: (x, y, radius, startAngle, endAngle, options) => {
        if (typeof options === "undefined")
            options = { moveToStart: true };
        const end = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
        const start = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);
        // Split full circles into two halves.
        // Some browsers have problems to render full circles (described by start==end).
        if (Math.PI * 2 - Math.abs(startAngle - endAngle) < 0.001) {
            const firstHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle, startAngle + (endAngle - startAngle) / 2, options);
            const secondHalf = CircleSector.circleSectorUtils.describeSVGArc(x, y, radius, startAngle + (endAngle - startAngle) / 2, endAngle, options);
            return firstHalf.concat(secondHalf);
        }
        // Boolean stored as integers (0|1).
        const diff = endAngle - startAngle;
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
        const pathData = [];
        if (options.moveToStart) {
            pathData.push("M", start.x, start.y);
        }
        pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y);
        return pathData;
    }
};
//# sourceMappingURL=CircleSector.js.map