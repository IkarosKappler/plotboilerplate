/**
 * Remove duplicate vertices (2d) from an array.
 *
 * This method war taken and refactored from an older demo.
 *
 * @author   Ikaros Kappler
 * @date     2021-07-13
 * @modified 2023-10-28 Refactored and ported to Typescript.
 * @modified 2024-12-17 Simplified this method to work with generic sub types of XYCoords as well.
 * @version  1.0.1
 */
import { XYCoords } from "../../interfaces";
/**
 * Filter the array and clear all duplicates.
 *
 * The original array is left unchanged. The vertices in the array are not cloned.
 *
 * @param {XYCoords[]} vertices
 * @param {number=EPS} epsilon
 * @return {Vertex[]}
 */
export declare const clearDuplicateVertices: <T extends XYCoords>(vertices: T[], epsilon?: number) => T[];
