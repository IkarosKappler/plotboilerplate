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
import { Circle } from "../../Circle";
import { Vertex } from "../../Vertex";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class CircleHelper {
    circle: Circle;
    radiusPoint: Vertex;
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleHelper
     * @param {Circle} circle - The circle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    constructor(circle: Circle, radiusPoint: Vertex);
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle points.
     *
     * @method destroy
     * @instance
     * @memberof CircleHelper
     */
    destroy(): void;
    /**
     * Creates a new drag handler for the circle's center point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    private handleDragCenter;
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    private handleDragRadiusPoint;
}
