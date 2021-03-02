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
var VEllipse_1 = require("./VEllipse");
var UIDGenerator_1 = require("./UIDGenerator");
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
    VEllipseSector.ellipseSectorUtils = {
        /**
         * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
         * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusH, radiusV, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: function (x, y, radiusH, radiusV, startAngle, endAngle, rotation, options) {
            if (typeof options === 'undefined')
                options = { moveToStart: true };
            if (typeof rotation === 'undefined')
                rotation = 0.0;
            console.log('rotation', rotation);
            // XYCoords
            var end = new Vertex_1.Vertex(VEllipse_1.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, endAngle));
            var start = new Vertex_1.Vertex(VEllipse_1.VEllipse.utils.polarToCartesian(x, y, radiusH, radiusV, startAngle));
            end.rotate(rotation, { x: x, y: y });
            start.rotate(rotation, { x: x, y: y });
            var diff = endAngle - startAngle;
            /*
              var r2d = 180/Math.PI;
              console.log( "startAngle", (r2d*startAngle).toFixed(4),
              "endAngle", (r2d*endAngle).toFixed(4),
              "diff=" + (r2d*diff).toFixed(4) );
            */
            // Boolean stored as integers (0|1).
            var largeArcFlag;
            // var sweepFlag : numner;
            if (diff < 0) {
                largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
                // sweepFlag = 1;
            }
            else {
                largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
                // sweepFlag = 1;
            }
            var sweepFlag = 1;
            var pathData = [];
            if (options.moveToStart) {
                pathData.push('M', start.x, start.y);
            }
            pathData.push("A", radiusH, radiusV, rotation, largeArcFlag, sweepFlag, end.x, end.y);
            return pathData;
        } // END function describeSVGArc
    }; // END ellipseSectorUtils
    return VEllipseSector;
}());
exports.VEllipseSector = VEllipseSector;
;
//# sourceMappingURL=VEllipseSector.js.map