/**
 * @classdesc A wrapper for image objects.
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version 1.0.2
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/
import { Vertex } from "./Vertex";
import { SVGSerializable } from "./interfaces";
export declare class PBImage implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * @member {Vertex}
     * @memberof PBImage
     * @instance
     */
    image: HTMLImageElement;
    /**
     * @member {Vertex}
     * @memberof PBImage
     * @instance
     */
    upperLeft: Vertex;
    /**
     * @member {Vertex}
     * @memberof PBImage
     * @instance
     */
    lowerRight: Vertex;
    /**
     * The constructor.
     *
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    constructor(image: HTMLImageElement, upperLeft: Vertex, lowerRight: Vertex);
    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    toSVGString(options: {
        className?: string;
    }): string;
}
