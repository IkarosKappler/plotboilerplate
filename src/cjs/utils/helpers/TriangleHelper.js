"use strict";
/**
 * Easily handle triangles with this triangle interaction helper: always keep your
 * triangles equilateral.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-05
 * @version  1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriangleHelper = void 0;
var Vector_1 = require("../../Vector");
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
var TriangleHelper = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name TriangleHelper
     * @param {Triangle} triangle - The triangle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    function TriangleHelper(triangle, setInitiallyEquilateral) {
        this.triangle = triangle;
        triangle.a.listeners.addDragListener((this.handlerA = this._handleTrianglePoint(this.triangle.a, this.triangle.b, this.triangle.c)));
        triangle.b.listeners.addDragListener((this.handlerB = this._handleTrianglePoint(this.triangle.b, this.triangle.c, this.triangle.a)));
        triangle.c.listeners.addDragListener((this.handlerC = this._handleTrianglePoint(this.triangle.c, this.triangle.a, this.triangle.b)));
        // Trigger to set equilateral
        if (setInitiallyEquilateral) {
            this.handlerC(null); // We know by construction that _here_ the param is optional!
        }
    }
    //--- BEGIN --- Implement ISHapeInteractionHelper ---
    /**
     * Let this shape helper draw it's handle lines. It's up to the helper what they look like.
     * @param {DrawLib<any>} draw - The draw library to use.
     * @param {DrawLib<any>} fill - The fill library to use.
     */
    TriangleHelper.prototype.drawHandleLines = function (_draw, _fill) {
        // NOOP
    };
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle points.
     *
     * @method destroy
     * @instance
     * @memberof TriangleHelper
     */
    TriangleHelper.prototype.destroy = function () {
        this.triangle.a.listeners.removeDragListener(this.handlerA);
        this.triangle.b.listeners.removeDragListener(this.handlerB);
        this.triangle.c.listeners.removeDragListener(this.handlerC);
    };
    //--- END --- Implement ISHapeInteractionHelper ---
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method _handleDragCenter
     * @instance
     * @memberof TriangleHelper
     * @returns A new event handler.
     */
    TriangleHelper.prototype._handleTrianglePoint = function (vertex1, vertex2, vertex3) {
        var _self = this;
        return function (_evt) {
            //   _self.circle.radius = _self.circle.center.distance(_self.radiusPoint);
            // Calculate new side length: set equialateral
            var vec = new Vector_1.Vector(vertex1, vertex2);
            var mid = vec.vertAt(0.5);
            var perp = vec.perp().add(mid).sub(vec.a);
            perp.setLength((vec.length() * Math.sqrt(3)) / 2); // The height of a equilateral triangle
            vertex3.set(perp.b);
        };
    };
    return TriangleHelper;
}());
exports.TriangleHelper = TriangleHelper;
//# sourceMappingURL=TriangleHelper.js.map