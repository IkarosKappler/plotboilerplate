/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Vertex, SVGSerializale
 *
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 *
 * @file Circle
 * @public
 **/
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable } from "./interfaces";
export declare class Circle implements SVGSerializable {
    /**
     * @member {center}
     * @memberof Vertex
     * @instance
     */
    center: Vertex;
    /**
      * @member {radius}
      * @memberof number
      * @instance
      */
    radius: number;
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(center: Vertex, radius: number);
    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value
     *   will be max inner distance and it will be negative.
     *
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     */
    lineDistance(line: VertTuple<any>): number;
    /**
      * Create an SVG representation of this circle.
      *
      * @param {object} options { className?:string }
      * @return string The SVG string
      */
    toSVGString(options: {
        className?: string;
    }): string;
}
