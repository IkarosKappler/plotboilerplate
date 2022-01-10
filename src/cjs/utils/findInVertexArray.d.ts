/**
 * @author  Ikaros Kappler
 * @date    2022-01-10
 * @version 1.0.0
 */
import { Vertex } from "../Vertex";
import { XYCoords } from "../interfaces";
/**
 * In an array of vertices find the first occurence of a specific vertex, using
 * and epsilon tolerance.
 *
 * @param {Array<Vertex>} vertexList - The vertex array to search in.
 * @param {XYCoords} vertex - A vertex/position to search for. This can be any x-y-tuple and does not
 *                              necessarily need to be an instance of Vertex.
 * @param {number} epsilon - The epsilon tolerance to use (should be >= 0). This is a required param to avoid excessive
 *                              is-undef checking if this function runs in a loop.
 * @returns {boolean} - The first index of a vertex that matched or -1 if no such vertex could be found.
 */
export declare const findInVertexArray: (vertexList: Array<Vertex>, vertex: XYCoords, epsilon: number) => number;
