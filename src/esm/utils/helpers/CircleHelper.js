/**
 * Easily handle circles (mouse or touch) with this circle helper.
 *
 * The circle has the center point and a second point to determine the radius.
 *
 * @author   Ikaros Kappler
 * @date     2020-09-07
 * @modified 2020-10-18 Ported to Typescript from vanilla JS.
 * @modified 2021-01-22 Removed `pb.redraw()` call from update handlers (changed vertices already triggered redraw).
 * @modified 2024-02-26 Removed the constructor param `pb` (unused).
 * @modified 2024-02-25 Added `circle` and `radiusPoint` attributes.
 * @version  1.2.0
 **/
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export class CircleHelper {
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleHelper
     * @param {Circle} circle - The circle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    constructor(circle, radiusPoint) {
        this.circle = circle;
        this.radiusPoint = radiusPoint;
        circle.center.listeners.addDragListener(this.handleDragCenter());
        radiusPoint.listeners.addDragListener(this.handleDragRadiusPoint());
    }
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle points.
     *
     * @method destroy
     * @instance
     * @memberof CircleHelper
     */
    destroy() {
        this.circle.center.listeners.removeDragListener(this.handleDragCenter);
        this.radiusPoint.listeners.removeDragListener(this.handleDragRadiusPoint);
    }
    /**
     * Creates a new drag handler for the circle's center point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    handleDragCenter() {
        const _self = this;
        return (evt) => {
            _self.radiusPoint.add(evt.params.dragAmount);
        };
    }
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    handleDragRadiusPoint() {
        const _self = this;
        return (_evt) => {
            _self.circle.radius = _self.circle.center.distance(_self.radiusPoint);
        };
    }
}
//# sourceMappingURL=CircleHelper.js.map