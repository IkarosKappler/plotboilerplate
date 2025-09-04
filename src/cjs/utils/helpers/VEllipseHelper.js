"use strict";
/**
 * A helper for VEllipses.
 *
 * @author   Ikaros Kappler
 * @date     2025-03-31
 * @modified 2025-04-02 Adding `VEllipseHelper.drawHandleLines()`.
 * @modified 2025-04-09 Adding `VEllipseHelper.destroy()`.
 * @modified 2025-05-05 Fixed a typo in the `VEllipseHelper.destroy` method (was named `detroy`).
 * @modified 2025-05-05 `VEllipseHelper` is now implementing `IShapeInteractionHelper`.
 * @version  1.0.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipseHelper = void 0;
var Line_1 = require("../../Line");
var VEllipseHelper = /** @class */ (function () {
    function VEllipseHelper(ellipse, rotationControlPoint) {
        this.ellipse = ellipse;
        this.rotationControlPoint = rotationControlPoint;
        // const rotationControlLine: Line = new Line(ellipse.center, rotationControlPoint);
        this._rotationControlLine = new Line_1.Line(ellipse.center, rotationControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        // ellipse.center.listeners.addDragListener((event: VertEvent) => {
        //   rotationControlPoint.add(event.params.dragAmount);
        // });
        ellipse.center.listeners.addDragListener((this._centerPointHandler = this._handleDragCenterPoint()));
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        // rotationControlPoint.listeners.addDragListener((_event: VertEvent) => {
        //   var newRotation = rotationControlLine.angle();
        //   var rDiff = newRotation - ellipse.rotation;
        //   ellipse.rotation = newRotation;
        //   ellipse.axis.rotate(rDiff, ellipse.center);
        // });
        rotationControlPoint.listeners.addDragListener((this._rotationPointHandler = this._handleRotationCenterPoint()));
    }
    VEllipseHelper.prototype._handleDragCenterPoint = function () {
        var _self = this;
        return function (event) {
            _self.rotationControlPoint.add(event.params.dragAmount);
        };
    };
    VEllipseHelper.prototype._handleRotationCenterPoint = function () {
        var _self = this;
        return function (_event) {
            var newRotation = _self._rotationControlLine.angle();
            var rDiff = newRotation - _self.ellipse.rotation;
            _self.ellipse.rotation = newRotation;
            _self.ellipse.axis.rotate(rDiff, _self.ellipse.center);
        };
    };
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    VEllipseHelper.prototype.drawHandleLines = function (draw, fill) {
        // Draw rotation handle line
        draw.line(this.ellipse.center, this.rotationControlPoint, "rgba(192,64,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw helper box
        draw.setCurrentId("".concat(this.ellipse.uid, "_e0"));
        draw.setCurrentClassName("".concat(this.ellipse.className, "-v-line"));
        draw.line(this.ellipse.center.clone().add(0, this.ellipse.signedRadiusV()).rotate(this.ellipse.rotation, this.ellipse.center), this.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.setCurrentId("".concat(this.ellipse.uid, "_e1"));
        draw.setCurrentClassName("".concat(this.ellipse.className, "-h-line"));
        draw.line(this.ellipse.center.clone().add(this.ellipse.signedRadiusH(), 0).rotate(this.ellipse.rotation, this.ellipse.center), this.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
    };
    VEllipseHelper.prototype.destroy = function () {
        this.ellipse.center.listeners.removeDragListener(this._centerPointHandler);
        this.rotationControlPoint.listeners.removeDragListener(this._rotationPointHandler);
    };
    return VEllipseHelper;
}());
exports.VEllipseHelper = VEllipseHelper;
//# sourceMappingURL=VEllipseHelper.js.map