/**
 * A helper function to generate randmoized non-intersecting polygons.
 *
 * @author  Ikaros Kappler
 * @date    2025-03-23 (ported to Typescript from a helper script from 2024)
 * @version 1.0.0
 */
import { Bounds } from "../../Bounds";
import { Polygon } from "../../Polygon";
/**
 * @param numVertices
 * @returns
 */
export declare const createRandomizedPolygon: (numVertices: number, viewport: Bounds, createClockwise?: boolean) => Polygon;
