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
 * @version  1.0.1
 **/
import { CircleSector } from "../../CircleSector";
import { PlotBoilerplate } from "../../PlotBoilerplate";
import { Vertex } from "../../Vertex";
/**
 * @classdesc A helper for handling circles with an additional radius-control-point.
 */
export declare class CircleSectorHelper {
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
}
