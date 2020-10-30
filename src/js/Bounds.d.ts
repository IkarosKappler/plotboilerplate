/**
 * @classdesc A bounds class with min and max values.
 *
 * @requires XYCoords, Vertex, IBounds
 *
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @version  1.1.0
 *
 * @file Bopunds
 * @fileoverview A simple bounds class implementing IBounds.
 * @public
 **/
import { XYCoords, IBounds, XYDimension } from "./interfaces";
import { Vertex } from "./Vertex";
export declare class Bounds implements IBounds, XYDimension {
    /**
     * @member {XYCoords}
     * @memberof Bounds
     * @instance
     * @public
     */
    min: XYCoords;
    /**
     * @member {XYCoords}
     * @memberof Bounds
     * @instance
     * @public
     */
    max: XYCoords;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     * @public
     */
    width: number;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     * @public
     */
    height: number;
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
