"use strict";
/**
 * A helper for VEllipses.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-31
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipseHelper = void 0;
var Line_1 = require("../../Line");
var VEllipseHelper = /** @class */ (function () {
    function VEllipseHelper(ellipse, rotationControlPoint) {
        this.ellipse = ellipse;
        this.rotationControlPoint = rotationControlPoint;
        var rotationControlLine = new Line_1.Line(ellipse.center, rotationControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        ellipse.center.listeners.addDragListener(function (event) {
            rotationControlPoint.add(event.params.dragAmount);
        });
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        rotationControlPoint.listeners.addDragListener(function (_event) {
            var newRotation = rotationControlLine.angle();
            var rDiff = newRotation - ellipse.rotation;
            ellipse.rotation = newRotation;
            ellipse.axis.rotate(rDiff, ellipse.center);
        });
    }
    VEllipseHelper.prototype.drawHandleLines = function (draw, fill) {
        // Draw rotation handle line
        draw.line(this.ellipse.center, this.rotationControlPoint, "rgba(64,192,128,0.333)", 1.0);
    };
    return VEllipseHelper;
}());
exports.VEllipseHelper = VEllipseHelper;
//# sourceMappingURL=VEllipseHelper.js.map