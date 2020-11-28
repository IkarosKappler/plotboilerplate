/**
 * Todos:
 *  + use a Drawable interface
 *  + use a SVGSerializable interface
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-12-04
 * @modified 2019-11-07 Added the 'Triangle' style class.
 * @modified 2019-11-13 Added the <?xml ...?> tag.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @version  1.0.3
 **/
import { Vertex } from "./Vertex";
import { SVGSerializable } from "./interfaces";
/**
 * @classdesc A default SVG builder.
 *
 * @requires SVGSerializable
 * @requires Vertex
 * @requires XYCoords
 */
export declare class SVGBuilder {
    /**
     * @constructor
     **/
    constructor();
    /**
     *  Builds the SVG code from the given list of drawables.
     *
     * @param {object[]} drawables - The drawable elements (should implement Drawable) to be converted (each must have a toSVGString-function).
     * @param {object}   options  - { canvasSize, zoom, offset }
     * @return {string}
     **/
    build(drawables: Array<SVGSerializable>, options: {
        canvasSize: {
            width: number;
            height: number;
        };
        zoom: Vertex;
        offset: Vertex;
    }): string;
}
