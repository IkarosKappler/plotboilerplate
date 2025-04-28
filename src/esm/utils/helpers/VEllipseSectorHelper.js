/**
 * A helper for VEllipseSectors.
 *
 * @author   Ikaros Kappler
 * @date     2021-03-24
 * @modified 2025-04-02 Adding `VEllipseSectorHelper.drawHandleLines`.
 * @modified 2025-04-07 Modifying the calculation of `startAngle` and `endAngle` from the rotation control point: wrapping result into [0,TWO_PI).
 * @modified 2025-04-09 Adding the `VEllipseSectorHelper.destroy` method.
 * @version  1.1.0
 */
import { Line } from "../../Line";
import { geomutils } from "../../geomutils";
export class VEllipseSectorHelper {
    constructor(sector, startAngleControlPoint, endAngleControlPoint, rotationControlPoint) {
        this.sector = sector;
        this.startAngleControlPoint = startAngleControlPoint;
        this.endAngleControlPoint = endAngleControlPoint;
        this.rotationControlPoint = rotationControlPoint;
        // const rotationControlLine: Line = new Line(sector.ellipse.center, rotationControlPoint);
        this._rotationControlLine = new Line(sector.ellipse.center, rotationControlPoint);
        // const startAngleControlLine: Line = new Line(sector.ellipse.center, startAngleControlPoint);
        this._startAngleControlLine = new Line(sector.ellipse.center, startAngleControlPoint);
        // const endAngleControlLine: Line = new Line(sector.ellipse.center, endAngleControlPoint);
        this._endAngleControlLine = new Line(sector.ellipse.center, endAngleControlPoint);
        // +---------------------------------------------------------------------
        // | Listen for the center to be moved.
        // +-------------------------------------------
        sector.ellipse.center.listeners.addDragListener((this._centerHandler = this._handleDragCenterPoint()));
        // +---------------------------------------------------------------------
        // | Listen for rotation changes.
        // +-------------------------------------------
        rotationControlPoint.listeners.addDragListener((this._rotationHandler = this._handleDragRotationControlPoint()));
        // +---------------------------------------------------------------------
        // | Listen for start angle changes.
        // +-------------------------------------------
        startAngleControlPoint.listeners.addDragListener((this._startAngleHandler = this._handleDragStartAngleControlPoint()));
        // +---------------------------------------------------------------------
        // | Listen for end angle changes.
        // +-------------------------------------------
        endAngleControlPoint.listeners.addDragListener((this._endAngleHandler = this._handleDragEndAngleControlPoint()));
    }
    /**
     * Creates a new drag handler for the circle sector's start control point.
     *
     * @private
     * @method _handleDragStartControlPoint
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    _handleDragCenterPoint() {
        const _self = this;
        return (event) => {
            _self.startAngleControlPoint.add(event.params.dragAmount);
            _self.endAngleControlPoint.add(event.params.dragAmount);
            _self.rotationControlPoint.add(event.params.dragAmount);
        };
    }
    _handleDragRotationControlPoint() {
        const _self = this;
        return (event) => {
            const newRotation = _self._rotationControlLine.angle();
            const rDiff = newRotation - _self.sector.ellipse.rotation;
            _self.sector.ellipse.rotation = newRotation;
            _self.sector.ellipse.axis.rotate(rDiff, _self.sector.ellipse.center);
            _self.startAngleControlPoint.rotate(rDiff, _self.sector.ellipse.center);
            _self.endAngleControlPoint.rotate(rDiff, _self.sector.ellipse.center);
        };
    }
    _handleDragStartAngleControlPoint() {
        const _self = this;
        return (_event) => {
            // sector.startAngle = startAngleControlLine.angle() - sector.ellipse.rotation;
            _self.sector.startAngle = geomutils.mapAngleTo2PI(_self._startAngleControlLine.angle() - _self.sector.ellipse.rotation);
        };
    }
    _handleDragEndAngleControlPoint() {
        const _self = this;
        return (event) => {
            _self.sector.endAngle = geomutils.mapAngleTo2PI(_self._endAngleControlLine.angle() - _self.sector.ellipse.rotation);
        };
    }
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw, fill) {
        draw.line(this.sector.ellipse.center, this.startAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.line(this.sector.ellipse.center, this.endAngleControlPoint, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw rotation handle line
        draw.line(this.sector.ellipse.center, this.rotationControlPoint, "rgba(192,64,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        // Draw helper box
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
    } // END drawHandleLines
    /**
     * Destroy this VEllipseHandler which means: all listeners are being removed.
     */
    destroy() {
        this.sector.ellipse.center.listeners.removeDragListener(this._centerHandler);
        this.rotationControlPoint.listeners.removeDragListener(this._rotationHandler);
        this.startAngleControlPoint.listeners.removeDragListener(this._startAngleHandler);
        this.endAngleControlPoint.listeners.removeDragListener(this._endAngleHandler);
    }
}
//# sourceMappingURL=VEllipseSectorHelper.js.map