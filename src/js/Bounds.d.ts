/**
 * @classdesc A bounds class with min and max values.
 *
 * @requires XYCoords, Vertex, IBounds
 *
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @version  1.0.0
 *
 * @file Bopunds
 * @fileoverview A simple bounds class implementing IBounds.
 * @public
 **/
import { XYCoords, IBounds, XYDimension } from "./interfaces";
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
}
