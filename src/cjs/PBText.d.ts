/**
 * @author   Ikaros Kappler
 * @date     2021-11-16
 * @modified 2022-02-02 Added the `destroy` method.
 * @version  1.1.0
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
     * @member isDestroyed
     * @memberof PBText
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
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
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
}
