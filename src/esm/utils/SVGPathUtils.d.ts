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
     * @param center
     * @param innerRadius
     * @param outerRadius
     * @param startAngle
     * @param endAngle
     * @returns
     */
    mkCircularRingSector: (center: Vertex, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => SVGPathParams;
};
