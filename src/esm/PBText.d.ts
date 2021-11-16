/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @version  1.0.0
 **/
import { Vertex } from "./Vertex";
import { FontOptions, FontStyle, FontWeight, SVGSerializable, UID } from "./interfaces";
/**
 * @classdesc A simple text element: position, fontSize, fontFamily, color, textAlign, lineHeight and rotation.
 *
 * @requires FontOptions
 * @requires FontSize
 * @requires FontStyle
 * @requires FontWeight
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export declare class PBText implements SVGSerializable, FontOptions {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof PBText
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {string}
     * @memberof PBText
     * @instance
     */
    text: string;
    /**
     * @member {Vertex}
     * @memberof PBText
     * @instance
     */
    anchor: Vertex;
    /**
     * @member {number}
     * @memberof PBText
     * @instance
     */
    fontSize: number | undefined;
    /**
     * @member {number}
     * @memberof PBText
     * @instance
     */
    lineHeight: number | undefined;
    /**
     * @member {FontWeight}
     * @memberof PBText
     * @instance
     */
    fontWeight: FontWeight | undefined;
    /**
     * @member {FontStyle}
     * @memberof PBText
     * @instance
     */
    fontStyle: FontStyle | undefined;
    /**
     * @member {CanvasRenderingContext2D["textAlign"]}
     * @memberof PBText
     * @instance
     */
    textAlign: CanvasRenderingContext2D["textAlign"] | undefined;
    /**
     * @member {number}
     * @memberof PBText
     * @instance
     */
    rotation: number | undefined;
    /**
     * @member {number}
     * @memberof PBText
     * @instance
     */
    fontFamily: string | undefined;
    /**
     * @member {number}
     * @memberof PBText
     * @instance
     */
    color: string | undefined;
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(text: string, anchor?: Vertex, options?: FontOptions);
    /**
     * Create an SVG representation of this circle.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Circle
     */
    toSVGString(options: {
        className?: string;
    }): string;
}
