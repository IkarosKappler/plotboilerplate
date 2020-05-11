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
     */
    min: XYCoords;
    /**
     * @member {XYCoords}
     * @memberof Bounds
     * @instance
     */
    max: XYCoords;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     */
    width: number;
    /**
     * @member {number}
     * @memberof Bounds
     * @instance
     */
    height: number;
    /**
     * The constructor.
     *
     * @constructor
     * @name Grid
     * @param {XYCoords} min - The min values (x,y) as a XYCoord tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoord tuple.
     **/
    constructor(min: XYCoords, max: XYCoords);
}
