"use strict";
/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @modified 2025-05-07 Modifying the calculation of `startAngle` and `endAngle` from the rotation control point: wrapping result into [0,TWO_PI).
 * @version  1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipseSectorHelper = void 0;
var Line_1 = require("../../Line");
var geomutils_1 = require("../../geomutils");
var VEllipseSectorHelper = /** @class */ (function () {
    function VEllipseSectorHelper(sector, startAngleControlPoint, endAngleControlPoint, rotationControlPoint) {
        this.sector = sector;
        this.startAngleControlPoint = startAngleControlPoint;
        this.endAngleControlPoint = endAngleControlPoint;
        this.rotationControlPoint = rotationControlPoint;
        var rotationControlLine = new Line_1.Line(sector.ellipse.center, rotationControlPoint);
        var startAngleControlLine = new Line_1.Line(sector.ellipse.center, startAngleControlPoint);
        var endAngleControlLine = new Line_1.Line(sector.ellipse.center, endAngleControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        sector.ellipse.center.listeners.addDragListener(function (event) {
            startAngleControlPoint.add(event.params.dragAmount);
            endAngleControlPoint.add(event.params.dragAmount);
            rotationControlPoint.add(event.params.dragAmount);
        });
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        rotationControlPoint.listeners.addDragListener(function (event) {
            var newRotation = rotationControlLine.angle();
            var rDiff = newRotation - sector.ellipse.rotation;
            sector.ellipse.rotation = newRotation;
            sector.ellipse.axis.rotate(rDiff, sector.ellipse.center);
            startAngleControlPoint.rotate(rDiff, sector.ellipse.center);
            endAngleControlPoint.rotate(rDiff, sector.ellipse.center);
        });
        // +---------------------------------------------------------------------
        // | Listen for start angle changes.
        // +-------------------------------------------
        startAngleControlPoint.listeners.addDragListener(function (event) {
            // sector.startAngle = startAngleControlLine.angle() - sector.ellipse.rotation;
            sector.startAngle = geomutils_1.geomutils.mapAngleTo2PI(startAngleControlLine.angle() - sector.ellipse.rotation);
        });
        // +---------------------------------------------------------------------
        // | Listen for end angle changes.
        // +-------------------------------------------
        endAngleControlPoint.listeners.addDragListener(function (event) {
            sector.endAngle = geomutils_1.geomutils.mapAngleTo2PI(endAngleControlLine.angle() - sector.ellipse.rotation);
        });
    }
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    VEllipseSectorHelper.prototype.drawHandleLines = function (draw, fill) {
        draw.line(this.sector.ellipse.center, this.startAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.line(this.sector.ellipse.center, this.endAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw rotation handle line
        draw.line(this.sector.ellipse.center, this.rotationControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw helper box
        var xAxisPoint = this.sector.ellipse.vertAt(0.0);
        var yAxisPoint = this.sector.ellipse.vertAt(-Math.PI / 2.0);
        // Draw rotation handle line
        // draw.line(xAxisPoint, this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
        //   dashOffset: 0.0,
        //   dashArray: [4, 2]
        // });
        // draw.line(yAxisPoint, this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
        //   dashOffset: 0.0,
        //   dashArray: [4, 2]
        // });
        draw.line(this.sector.ellipse.center
            .clone()
            .add(0, this.sector.ellipse.signedRadiusV())
            .rotate(this.sector.ellipse.rotation, this.sector.ellipse.center), this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.line(this.sector.ellipse.center
            .clone()
            .add(this.sector.ellipse.signedRadiusH(), 0)
            .rotate(this.sector.ellipse.rotation, this.sector.ellipse.center), this.sector.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
    };
    return VEllipseSectorHelper;
}());
exports.VEllipseSectorHelper = VEllipseSectorHelper;
//# sourceMappingURL=VEllipseSectorHelper.js.map