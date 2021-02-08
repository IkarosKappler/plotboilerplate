/**
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2020-12-20
 */
import { Vertex } from "../../Vertex";
/**
 * Remove all duplicate neighbours from the given polygon.
 *
 * Imagagine a polygon:
 * [ [0,0], [10,10], [10,10], [10,10], [20,20], [10,10], [30,30], [0,0] ]
 *
 * The returned vertex array will then be:
 * [ [10,10], [20,20], [10,10], [30,30], [0,0] ]
 *
 * Duplicate neighbours (and only neightours) of a run of any length will be removed.
 *
 * @method clearPolygonDuplicateVertices
 * @param {Array<Vertex>} vertices - The polygon vertices to use.
 * @param {number=0} epsilon - The epsilon area to use around each vertex to check equality.
 * @return {Array<Vertex>}
 */
export declare const clearPolygonDuplicateVertices: (vertices: Array<Vertex>, epsilon?: number) => Array<Vertex>;
