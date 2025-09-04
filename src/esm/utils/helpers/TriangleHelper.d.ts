/**
 * Easily handle triangles with this triangle interaction helper: always keep your
 * triangles equilateral.
 *
 * @author   Ikaros Kappler
 * @date     2025-05-05
 * @version  1.0.0
 **/
import { Vertex } from "../../Vertex";
import { IShapeInteractionHelper } from "../../interfaces/core";
import { DrawLib } from "../../interfaces/DrawLib";
import { Triangle } from "../../Triangle";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class TriangleHelper implements IShapeInteractionHelper {
    triangle: Triangle;
    radiusPoint: Vertex;
    private handlerA;
    private handlerB;
    private handlerC;
    /**
     * The constructor.
     *
     * @constructor
     * @name TriangleHelper
     * @param {Triangle} triangle - The triangle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    constructor(triangle: Triangle, setInitiallyEquilateral?: boolean);
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
     * @memberof TriangleHelper
     */
    destroy(): void;
    /**
     * Creates a new drag handler for the circle's radius control point.
     *
     * @private
     * @method _handleDragCenter
     * @instance
     * @memberof TriangleHelper
     * @returns A new event handler.
     */
    private _handleTrianglePoint;
}
