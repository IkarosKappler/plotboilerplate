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
 * @version  1.0.1
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
    function CircleHelper(circle, radiusPoint, pb) {
        circle.center.listeners.addDragListener(function (e) {
            radiusPoint.add(e.params.dragAmount);
            // pb.redraw();
        });
        radiusPoint.listeners.addDragListener(function (e) {
            circle.radius = circle.center.distance(radiusPoint);
            // pb.redraw();
        });
    }
    ;
    return CircleHelper;
}());
exports.CircleHelper = CircleHelper;
//# sourceMappingURL=CircleHelper.js.map