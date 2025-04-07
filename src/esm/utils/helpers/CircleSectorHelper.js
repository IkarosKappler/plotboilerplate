/**
 * @author   Ikaros Kappler
 * @modified 2021-01-22
 * @version  1.0.0
 */
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export class CircleSectorHelper {
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleSectorHelper
     * @param {CircleSector} circleSector - The circle sector to handle.
     * @param {Vertex} controlPointStart - A point to define the radius and start angle (distance and angle from center).
     * @param {Vertex} controlPointEnd - A point to define the radius and end angle (distance and angle from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle sector and both points.
     **/
    constructor(circleSector, controlPointStart, controlPointEnd, pb) {
        this.circleSector = circleSector;
        this.controlPointStart = controlPointStart;
        this.controlPointEnd = controlPointEnd;
        this.circleSector.circle.center.listeners.addDragListener((this.centerListener = this._handleDragCenter()));
        this.controlPointStart.listeners.addDragListener((this.radiusStartListener = this._handleDragStartControlPoint()));
        this.controlPointEnd.listeners.addDragListener((this.radiusEndListener = this._handleDragEndControlPoint()));
    }
    /**
     * Creates a new drag handler for the circle sector's center point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    _handleDragCenter() {
        const _self = this;
        return (e) => {
            _self.controlPointStart.add(e.params.dragAmount);
            _self.controlPointEnd.add(e.params.dragAmount);
        };
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
    _handleDragStartControlPoint() {
        const _self = this;
        return (e) => {
            _self.circleSector.circle.radius = _self.circleSector.circle.center.distance(_self.controlPointStart);
            _self.controlPointEnd.set(_self.circleSector.circle.vertAt(_self.circleSector.endAngle));
            _self.circleSector.startAngle = _self.circleSector.circle.center.angle(_self.controlPointStart);
        };
    }
    /**
     * Creates a new drag handler for the circle sector's end control point.
     *
     * @private
     * @method _handleDragEndControlPoint
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    _handleDragEndControlPoint() {
        const _self = this;
        return (e) => {
            _self.circleSector.circle.radius = _self.circleSector.circle.center.distance(_self.controlPointEnd);
            _self.controlPointStart.set(_self.circleSector.circle.vertAt(_self.circleSector.startAngle));
            _self.circleSector.endAngle = _self.circleSector.circle.center.angle(_self.controlPointEnd);
        };
    }
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw, fill) {
        draw.line(this.circleSector.circle.center, this.controlPointStart, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
        draw.line(this.circleSector.circle.center, this.controlPointEnd, "rgba(64,192,128,0.333)", 1.0, {
            dashOffset: 0.0,
            dashArray: [4, 2]
        });
    }
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle sector's points.
     *
     * @method destroy
     * @instance
     * @memberof CircleSectorHelper
     */
    destroy() {
        this.circleSector.circle.center.listeners.removeDragListener(this.centerListener);
        this.controlPointStart.listeners.removeDragListener(this.radiusStartListener);
        this.controlPointEnd.listeners.removeDragListener(this.radiusEndListener);
    }
}
//# sourceMappingURL=CircleSectorHelper.js.map