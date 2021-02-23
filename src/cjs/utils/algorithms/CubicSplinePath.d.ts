/**
 * @author   Ikaros Kappler (ported from basic script to class).
 * @date     2020-04-15
 * @modified 2020-08-19 Ported this class from vanilla JS to TypeScript.
 * @version  1.0.0
 *
 * @file CubicSplinePath
 * @public
 **/
import { CubicBezierCurve } from "../../CubicBezierCurve";
import { Vertex } from "../../Vertex";
interface IControlCoords {
    start: Array<number>;
    end: Array<number>;
}
/**
 * @classdesc Compute a natural cubic Bézier spline path from a given sequence of points/vertices.
 *
 * Inspired by http://weitz.de/hobby/
 *
 * @requires CubicBezierCurve
 * @requires HobbyPath
 * @requires Vertex
 */
export declare class CubicSplinePath {
    /**
     * @member {Array<Vertex>} vertices
     * @memberof CatmullRomPath
     * @type {Array<Vertex>}
     * @instance
     **/
    private vertices;
    /**
     * @constructor
     * @name CubicSplinePath
     * @param {Array<Vertex>=} vertices? - An optional array of vertices to initialize the path with.
     **/
    constructor(vertices?: Array<Vertex>);
    /**
    * Add a new point to the end of the vertex sequence.
    *
    * @name addPoint
    * @memberof CubicSplinePath
    * @instance
    * @param {Vertex} p - The vertex (point) to add.
    **/
    addPoint(p: Vertex): void;
    /**
     * Generate a sequence of cubic Bézier curves from the point set.
     *
     * @name generateCurve
     * @memberof CubicSplinePath
     * @instance
     * @param {boolean=} circular - Specify if the path should be closed.
     * @return Array<CubicBezierCurve>
     **/
    generateCurve(circular?: boolean): Array<CubicBezierCurve>;
    static utils: {
        naturalControlsClosed: (coords: Array<number>) => IControlCoords;
        naturalControlsOpen: (coords: Array<number>) => IControlCoords;
    };
}
export {};
