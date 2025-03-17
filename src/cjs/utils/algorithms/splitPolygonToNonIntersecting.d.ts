/**
 * @requires Line
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2020-12-04
 * @modified 2020-12-07 Ported from vanilla JS to typescript.
 * @modified 2024-11-22 Added the `insideBoundsOnly` param to the `splitPolygonToNonIntersecting` algorithm.
 * @version  1.1.0
 */
import { Vertex } from "../../Vertex";
/**
 * This function cuts a given self-intersecting polygon into non-self-intersecting
 * sub polygons.
 *
 * The algorithm only works for non-self-overlapping polygons:
 * Please note that the union set of the sub polygons themselves will _not_ be disjunct if
 * the input polyon overlaps with itself!
 *
 * See this illustration for details:
 * ./demos/27-polygon-intersection-greinerhormann/splitting-polygon-types.png
 *
 * @name splitPolygonToNonIntersecting
 * @param {Array<Vertex>} vertices - The polygon as an array of vertices.
 * @param {number=10} maxDepth - Number of max recursive steps (default is 10).
 * @return {Array<Array<Vertex>>} A sequence of non-self-intersecting sub polygons.
 */
export declare const splitPolygonToNonIntersecting: (vertices: Array<Vertex>, maxDepth?: number, insideBoundsOnly?: boolean) => Array<Array<Vertex>>;
