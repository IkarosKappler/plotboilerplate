/**
 * @author   Ikaros Kappler
 * @date     2019-02-03
 * @modified 2021-03-01 Added `wrapMax` function.
 * @modified 2024-11-15 Adding helper function `geomutils.mapAngleTo2PI(number)` for mapping any value into the interval [0,2*PI).
 * @modified 2024-11-22 Adding helper function `geomutils.dotProduct(number)` for calculating the dot product of two vertices (as vectors).
 *
 * @version  1.2.0
 **/
import { Line } from "./Line";
import { Vertex } from "./Vertex";
import { XYCoords } from "./interfaces";
/**
 * A collection of usefull geometry utilities.
 *
 * @global
 **/
export declare const geomutils: {
    /**
     * Map any angle (any numeric value) to [0, Math.PI).
     *
     * @param {number} angle - The numeric value to map.
     * @return {number} The mapped angle inside [0,PI*2].
     **/
    mapAngleTo2PI(angle: number): number;
    /**
     * Map any angle (any numeric value) to [0, Math.PI).
     *
     * A × B := (A.x * B.x) + (A.y * B.y)
     *
     * @param {XYCoords} vertA - The first vertex.
     * @param {XYCoords} vertB - The second vertex.
     * @return {number} The dot product of the two vertices.
     **/
    dotProduct(vertA: XYCoords, vertB: XYCoords): number;
    /**
     * Compute the n-section of the angle – described as a triangle (A,B,C) – in point A.
     *
     * @param {Vertex} pA - The first triangle point.
     * @param {Vertex} pB - The second triangle point.
     * @param {Vertex} pC - The third triangle point.
     * @param {number} n - The number of desired angle sections (example: 2 means the angle will be divided into two sections,
     *                      means an returned array with length 1, the middle line).
     *
     * @return {Line[]} An array of n-1 lines secting the given angle in point A into n equal sized angle sections. The lines' first vertex is A.
     */
    nsectAngle(pA: Vertex, pB: Vertex, pC: Vertex, n: number): Array<Line>;
    /**
     * Wrap the value (e.g. an angle) into the given range of [0,max).
     *
     * @name wrapMax
     * @param {number} x - The value to wrap.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [0,max).
     */
    wrapMax(x: number, max: number): number;
    /**
     * Wrap the value (e.g. an angle) into the given range of [min,max).
     *
     * @name wrapMinMax
     * @param {number} x - The value to wrap.
     * @param {number} min - The min bound to use for the range.
     * @param {number} max - The max bound to use for the range.
     * @return {number} The wrapped value inside the range [min,max).
     */
    wrapMinMax(x: number, min: number, max: number): number;
};
