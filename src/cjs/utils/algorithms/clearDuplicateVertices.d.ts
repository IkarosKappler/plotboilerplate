/**
 * Remove duplicate vertices (2d) from an array.
 *
 * This method war taken and refactored from an older demo.
 *
 * @author   Ikaros Kappler
 * @date     2021-07-13
 * @modified 2023-10-28 Refactored and ported to Typescript.
 * @version  1.0.0
 */
import { Vertex } from "../../Vertex";
/**
 * Filter the array and clear all duplicates.
 *
 * The original array is left unchanged. The vertices in the array are not cloned.
 *
 * @param {Vertex[]} vertices
 * @param {number=EPS} epsilon
 * @return {Vertex[]}
 */
export declare const clearDuplicateVertices: (vertices: Vertex[], epsilon: any) => Vertex[];
