/**
 * @requires Line
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-04
 * @modified 2020-12-09 Ported from vanilla JS to Typescript.
 * @modified 2024-11-22 Fixed a type error in line 41.
 */
import { Vertex } from "../../Vertex";
import { XYCoords } from "../../interfaces";
/**
 * Collect all self-intersection points of the given polygon.
 *
 * If the given polygon (vertices) is not self intersecting then the returned array is empty.
 *
 * @name findPolygonSelfIntersections
 * @param {Array<Vertex>} vertices - The vertices that form the polygon.
 * @return {Array<Vertex>}
 */
export declare const findPolygonSelfIntersections: (vertices: Array<XYCoords>) => Array<Vertex>;
