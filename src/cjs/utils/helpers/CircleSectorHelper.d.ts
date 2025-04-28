/**
 * @author   Ikaros Kappler
 * @modified 2021-01-22
 * @version  1.0.0
 */
/**
 * Easily handle circle sectors (mouse or touch) with this circle sector helper.
 *
 * The circle sector has the center point and two additional points to determine
 * radius, startAngle and endAngle.
 *
 * @author   Ikaros Kappler
 * @date     2021-01-22
 * @modified 2021-01-26 Moving control points with center points
 * @modified 2024-03-10 Adding the `destory` method for properly removing installed listeners.
 * @modified 2025-04-02 Adding `CircleSectorHelper.drawHandleLines()`,
 * @version  1.2.0
 **/
import { CircleSector } from "../../CircleSector";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
import { DrawLib } from "../../interfaces";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class CircleSectorHelper {
    private circleSector;
    private controlPointStart;
    private controlPointEnd;
    private centerListener;
    private radiusStartListener;
    private radiusEndListener;
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
    constructor(circleSector: CircleSector, controlPointStart: Vertex, controlPointEnd: Vertex, pb: PlotBoilerplate);
    /**
     * Creates a new drag handler for the circle sector's center point.
     *
     * @private
     * @method handleDragCenter
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    private _handleDragCenter;
    /**
     * Creates a new drag handler for the circle sector's start control point.
     *
     * @private
     * @method _handleDragStartControlPoint
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    private _handleDragStartControlPoint;
    /**
     * Creates a new drag handler for the circle sector's end control point.
     *
     * @private
     * @method _handleDragEndControlPoint
     * @instance
     * @memberof CircleSectorHelper
     * @returns A new event handler.
     */
    private _handleDragEndControlPoint;
    /**
     * Draw grey handle lines.
     *
     * @param {DrawLib<any>} draw - The draw library instance to use.
     * @param {DrawLib<any>} fill - The fill library instance to use.
     */
    drawHandleLines(draw: DrawLib<any>, fill: DrawLib<any>): void;
    /**
     * Destroy this circle helper.
     * The listeners will be removed from the circle sector's points.
     *
     * @method destroy
     * @instance
     * @memberof CircleSectorHelper
     */
    destroy(): void;
}
