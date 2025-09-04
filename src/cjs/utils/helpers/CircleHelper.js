"use strict";
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
 * @modified 2024-03-10 Fixed some issues in the `destroy` method; listeners were not properly removed.
 * @modified 2025-05-05 Class `BezierPathInteractionHelper` now implementing `IShapeInteractionHelper`.
 * @version  1.2.1
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleHelper = void 0;
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
var CircleHelper = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleHelper
     * @param {Circle} circle - The circle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    function CircleHelper(circle, radiusPoint) {
        this.circle = circle;
        this.radiusPoint = radiusPoint;
        circle.center.listeners.addDragListener((this.centerHandler = this._handleDragCenter()));
        radiusPoint.listeners.addDragListener((this.radiusHandler = this._handleDragRadiusPoint()));
    }
    //--- BEGIN --- Implement ISHapeInteractionHelper ---
    /**
     * Let this shape helper draw it's handle lines. It's up to the helper what they look like.
     * @param {DrawLib<any>} draw - The draw library to use.
     * @param {DrawLib<any>} fill - The fill library to use.
     */
    CircleHelper.prototype.drawHandleLines = function (_draw, _fill) {
        // NOOP
    };
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle points.
     *
     * @method destroy
     * @instance
     * @memberof CircleHelper
     */
    CircleHelper.prototype.destroy = function () {
        this.circle.center.listeners.removeDragListener(this.centerHandler);
        this.radiusPoint.listeners.removeDragListener(this.radiusHandler);
    };
    //--- END --- Implement ISHapeInteractionHelper ---
    /**
     * Creates a new drag handler for the circle's center point.
     *
     * @private
     * @method _handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    CircleHelper.prototype._handleDragCenter = function () {
        var _self = this;
        return function (evt) {
            _self.radiusPoint.add(evt.params.dragAmount);
        };
    };
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method _handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    CircleHelper.prototype._handleDragRadiusPoint = function () {
        var _self = this;
        return function (_evt) {
            _self.circle.radius = _self.circle.center.distance(_self.radiusPoint);
        };
    };
    return CircleHelper;
}());
exports.CircleHelper = CircleHelper;
//# sourceMappingURL=CircleHelper.js.map