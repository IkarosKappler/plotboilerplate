/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @modified 2022-02-01 Added the `toString` function.
 * @modified 2022-10-09 Added the `fromDimension` function.
 * @modified 2022-11-28 Added the `clone` method.
 * @version  1.6.0
 **/
import { Polygon } from "./Polygon";
import { XYCoords, IBounds, XYDimension } from "./interfaces";
import { Vertex } from "./Vertex";
/**
 * @classdesc A bounds class with min and max values. Implementing IBounds.
 *
 * @requires XYCoords
 * @requires Vertex
 * @requires IBounds
 **/
export declare class Bounds implements IBounds, XYDimension {
    /**
     * @member {XYCoords}
     * @memberof Bounds
     * @instance
     * @public
     */
    readonly min: XYCoords;
    /**
     * @member {XYCoords}
     * @memberof Bounds
     * @instance
     * @public
     */
    readonly max: XYCoords;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     * @public
     */
    readonly width: number;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     * @public
     */
    readonly height: number;
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    constructor(min: XYCoords, max: XYCoords);
    /**
     * Convert this rectangular bounding box to a polygon with four vertices.
     *
     * @method toPolygon
     * @instance
     * @memberof Bounds
     * @return {Polygon} This bound rectangle as a polygon.
     */
    toPolygon(): Polygon;
    /**
     * Get the center of this boinding box.
     *
     * @method getCenter
     * @instance
     * @memberof Bounds
     * @returns {Vertex} The center of these bounds.
     */
    getCenter(): Vertex;
    /**
     * Convert these bounds to a human readable form.
     *
     * Note: the returned format might change in the future, so please do not
     * rely on the returned string format.
     *
     * @method toString
     * @instance
     * @memberof Bounds
     * @returns {string} Get these bounds in a human readable form.
     */
    toString(): string;
    /**
     * Clone this bounds object (create a deep clone).
     *
     * @method clone
     * @instance
     * @memberof Bounds
     * @returns {Bounds} Creates a deep clone of this bounds object.
     */
    clone(): Bounds;
    /**
     * Compute the minimal bounding box for a given set of vertices.
     *
     * An empty vertex array will return an empty bounding box located at (0,0).
     *
     * @static
     * @method computeFromVertices
     * @memberof Bounds
     * @param {Array<Vertex>} vertices - The set of vertices you want to get the bounding box for.
     * @return The minimal Bounds for the given vertices.
     **/
    static computeFromVertices(vertices: Array<Vertex>): Bounds;
    /**
     * Create a new `Bounds` instance just from `width` and `height`, located at (0,0) or the optionally given origin.
     *
     * @param {number} width - The width of the bounds
     * @param {number} height  - The height of the bounds
     * @param {XYCoords={x:0,y:0}} origin - [optional] A origin to locate the new Bounds object at.
     * @returns {Bounds} A new `Bounds` instance width given width and height, located at (0,0) or the given origin..
     */
    static fromDimension(width: number, height: number, origin?: XYCoords): Bounds;
}
