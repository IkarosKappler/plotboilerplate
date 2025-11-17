"use strict";
/**
 * A collection of SVG path generation tools.
 *
 * @author  Ikaros Kappler
 * @date    2025-04-04
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGPathUtils = void 0;
var Circle_1 = require("../Circle");
var geomutils_1 = require("../geomutils");
exports.SVGPathUtils = {
    /**
     * Creates an SVG shape resembling a circlular ring sector.
     *
     * @param {Vertex} center - The center position of the ring.
     * @param {number} innerRadius - The inner radius of the ring.
     * @param {number} outerRadius - The outer radius of the ring.
     * @param {number} startAngle - The start angle of the ring.
     * @param {number} endAngle - The end angle of the ring.
     * @returns {SVGPathParams} SVG path parmams for a closed shape representing the circular ring sector.
     */
    mkCircularRingSector: function (center, innerRadius, outerRadius, startAngle, endAngle) {
        var innerStart = Circle_1.Circle.circleUtils.vertAt(startAngle, innerRadius).add(center);
        var innerEnd = Circle_1.Circle.circleUtils.vertAt(endAngle, innerRadius).add(center);
        var outerStart = Circle_1.Circle.circleUtils.vertAt(startAngle, outerRadius).add(center);
        var outerEnd = Circle_1.Circle.circleUtils.vertAt(endAngle, outerRadius).add(center);
        var buffer = ["M", innerStart.x, innerStart.y];
        // var isLargeArcRequired = geomutils.mapAngleTo2PI(Math.abs(startAngle - endAngle)) >= Math.PI;
        // var isLargeArcRequired = Math.abs(geomutils.mapAngleTo2PI(startAngle) - geomutils.mapAngleTo2PI(endAngle)) >= Math.PI;
        var isLargeArcRequired = geomutils_1.geomutils.mapAngleTo2PI(geomutils_1.geomutils.mapAngleTo2PI(startAngle) - geomutils_1.geomutils.mapAngleTo2PI(endAngle)) >= Math.PI;
        var rotation = 0.0;
        var innerLargeArcFlag = isLargeArcRequired ? 0 : 1;
        var innerSweepFlag = 1; // isLargeArcRequired ? 1 : 0; // 1;
        var outerLargeArcFlag = isLargeArcRequired ? 0 : 1;
        var outerSweepFlag = 0; // isLargeArcRequired ? 0 : 1; // 0;
        buffer.push("A", innerRadius, innerRadius, rotation, innerLargeArcFlag, innerSweepFlag, innerEnd.x, innerEnd.y);
        buffer.push("L", outerEnd.x, outerEnd.y);
        buffer.push("A", outerRadius, outerRadius, rotation, outerLargeArcFlag, outerSweepFlag, outerStart.x, outerStart.y);
        buffer.push("Z");
        return buffer;
    }
};
//# sourceMappingURL=SVGPathUtils.js.map