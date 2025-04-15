/**
 * A helper for VEllipses.
 *
 * @author   Ikaros Kappler
 * @date     2025-03-31
 * @modified 2025-04-02 Adding `VEllipseHelper.drawHandleLines()`.
 * @modified 2025-04-09 Adding `VEllipseHelper.destroy()`.
 * @version  1.0.0
 */
import { Line } from "../../Line";
export class VEllipseHelper {
    constructor(ellipse, rotationControlPoint) {
        this.ellipse = ellipse;
        this.rotationControlPoint = rotationControlPoint;
        // const rotationControlLine: Line = new Line(ellipse.center, rotationControlPoint);
        this._rotationControlLine = new Line(ellipse.center, rotationControlPoint);
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
    _handleDragCenterPoint() {
        const _self = this;
        return (event) => {
            _self.rotationControlPoint.add(event.params.dragAmount);
        };
    }
    _handleRotationCenterPoint() {
        const _self = this;
        return (_event) => {
            var newRotation = _self._rotationControlLine.angle();
            var rDiff = newRotation - _self.ellipse.rotation;
            _self.ellipse.rotation = newRotation;
            _self.ellipse.axis.rotate(rDiff, _self.ellipse.center);
        };
    }
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw, fill) {
        // Draw rotation handle line
        draw.line(this.ellipse.center, this.rotationControlPoint, "rgba(192,64,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw helper box
        draw.setCurrentId(`${this.ellipse.uid}_e0`);
        draw.setCurrentClassName(`${this.ellipse.className}-v-line`);
        draw.line(this.ellipse.center.clone().add(0, this.ellipse.signedRadiusV()).rotate(this.ellipse.rotation, this.ellipse.center), this.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.setCurrentId(`${this.ellipse.uid}_e1`);
        draw.setCurrentClassName(`${this.ellipse.className}-h-line`);
        draw.line(this.ellipse.center.clone().add(this.ellipse.signedRadiusH(), 0).rotate(this.ellipse.rotation, this.ellipse.center), this.ellipse.axis, "rgba(64,128,192,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
    }
    detroy() {
        this.ellipse.center.listeners.removeDragListener(this._centerPointHandler);
        this.rotationControlPoint.listeners.removeDragListener(this._rotationPointHandler);
    }
}
//# sourceMappingURL=VEllipseHelper.js.map