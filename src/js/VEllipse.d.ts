/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version  1.0.1
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
import { Vertex } from "./Vertex";
import { SVGSerializable } from "./interfaces";
/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires Vertex
 * @requires XYCoords
 */
export declare class VEllipse implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * @member {Vertex}
     * @memberof VEllipse
     * @instance
     */
    center: Vertex;
    /**
     * @member {Vertex}
     * @memberof VEllipse
     * @instance
     */
    axis: Vertex;
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    constructor(center: Vertex, axis: Vertex);
    /**
     * Create an SVG representation of this ellipse.
     *
     * @param {object} options { className?:string }
     * @return string The SVG string
     */
    toSVGString(options: {
        className?: string;
    }): string;
}
