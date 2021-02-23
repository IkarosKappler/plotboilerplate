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
import { Circle } from "../../Circle";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class CircleHelper {
    /**
     * The constructor.
     *
     * @constructor
     * @name CircleHelper
     * @param {Circle} circle - The circle to handle.
     * @param {Vertex} radiusPoint - A point to define the radius (distance from center).
     * @param {PlotBoilerplate} pb - The PlotBoilerplate which contains the circle and point.
     **/
    constructor(circle: Circle, radiusPoint: Vertex, pb: PlotBoilerplate);
}
