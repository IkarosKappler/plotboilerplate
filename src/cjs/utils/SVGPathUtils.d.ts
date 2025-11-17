/**
 * A collection of SVG path generation tools.
 *
 * @author  Ikaros Kappler
 * @date    2025-04-04
 * @version 1.0.0
 */
import { Vertex } from "../Vertex";
import { SVGPathParams } from "../interfaces";
export declare const SVGPathUtils: {
    /**
     * Creates an SVG shape resembling a circlular ring sector.
     *
     * @param {Vertex} center - The center position of the ring.
     * @param {number} innerRadius - The inner radius of the ring.
     * @param {number} outerRadius - The outer radius of the ring.
     * @param {number} startAngle - The start angle of the ring.
     * @param {number} endAngle - The end angle of the ring.
     * @returns {SVGPathParams} SVG path parmams for a closed shape representing the circular ring sector.
     */
    mkCircularRingSector: (center: Vertex, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => SVGPathParams;
};
