/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @version  1.2.0
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
}
