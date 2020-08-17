/**
 * @description Compute a max incircle for the given polygon.
 *
 * @requires Circle
 * @requires Line
 * @requires Vertex
 * @requires Triangle
 * @requires nsectAngle
 * @requires geomutils
 *
 * https://observablehq.com/@mbostock/convex-polygon-incircle
 * https://observablehq.com/@mbostock/circle-tangent-to-three-lines
 *
 * @author  mbostock, extended and ported to TypeScript by Ikaros Kappler
 * @date    2020-05-19
 * @version 1.0.1
 * @file    contextPolygonIncircle
 * @public
 */
import { Circle } from "../../Circle";
import { Polygon } from "../../Polygon";
import { Triangle } from "../../Triangle";
export interface PolygonIncircle {
    circle: Circle;
    triangle: Triangle;
}
/**
 * Compute the max sized inlying circle in the given convex (!) polygon - also called the
 * convex-polygon incircle.
 *
 * The function will return an object with either: the circle, and the triangle that defines
 * the three tangent points where the circle touches the polygon.
 *
 * @global
 * @name convexPolygonIncircle
 * @param {Polygon} convexHull - The actual convex polygon.
 * @return {PolygonIncircle} A pair of a circle (the incircle) and a triangle (the three points where the circle is touching the polygon).
 */
export declare const convexPolygonIncircle: (convexHull: Polygon) => PolygonIncircle;
