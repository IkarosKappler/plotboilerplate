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
import { Circle } from "../../Circle";
import { Vertex } from "../../Vertex";
import { IShapeInteractionHelper } from "../../interfaces/core";
import { DrawLib } from "../../interfaces/DrawLib";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class CircleHelper implements IShapeInteractionHelper {
    circle: Circle;
    radiusPoint: Vertex;
    private centerHandler;
    private radiusHandler;
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
     * Let this shape helper draw it's handle lines. It's up to the helper what they look like.
     * @param {DrawLib<any>} draw - The draw library to use.
     * @param {DrawLib<any>} fill - The fill library to use.
     */
    drawHandleLines(_draw: DrawLib<any>, _fill: DrawLib<any>): void;
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
     * @method _handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    private _handleDragCenter;
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method _handleDragCenter
     * @instance
     * @memberof CircleHelper
     * @returns A new event handler.
     */
    private _handleDragRadiusPoint;
}
