/**
 * @date     2020-04-15
 * @author   Converted to a class by Ikaros Kappler
 * @modified 2020-08-19 Ported this class from vanilla JS to TypeScript.
 * @version  1.0.1
 *
 * @file CatmullRomPath
 * @public
 **/
import { CubicBezierCurve } from "../../CubicBezierCurve";
import { Vertex } from "../../Vertex";
/**
 * @classdesc Compute the Catmull-Rom spline path from a sequence of points (vertices).
 *
 * For comparison to the HobbyCurve I wanted to add a Catmull-Rom path (to show that the
 * HobbyCurve is smoother).
 *
 * This demo implementation was inspired by this Codepen by Blake Bowen
 * https://codepen.io/osublake/pen/BowJed
 *
 * @requires CubicBezierCurve
 * @requires Vertex
 */
export declare class CatmullRomPath {
    /**
     * @member {Array<Vertex>} vertices
     * @memberof CatmullRomPath
     * @type {Array<Vertex>}
     * @instance
     **/
    private vertices;
    /**
     * @constructor
     * @name CatmullRomPath
     * @param {Array<Vertex>=} vertices? - An optional array of vertices to initialize the path with.
     **/
    constructor(vertices?: Array<Vertex>);
    /**
     * Add a new point to the end of the vertex sequence.
     *
     * @name addPoint
     * @memberof CatmullRomPath
     * @instance
     * @param {Vertex} p - The vertex (point) to add.
     **/
    addPoint(p: Vertex): void;
    /**
     * Generate a sequence of cubic Bézier curves from the point set.
     *
     * @name generateCurve
     * @memberof CatmullRomPath
     * @instance
     * @param {boolean=} circular - Specify if the path should be closed.
     * @param {number=1} tension - (default=0) An optional tension parameter.
     * @return Array<CubicBezierCurve>
     **/
    generateCurve(circular?: boolean, tension?: number): CubicBezierCurve[];
    private solveOpen;
    private solveClosed;
}
