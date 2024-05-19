/**
 * Generate regular polygons (N-Gons) and stars (N-Stars).
 *
 * @author   Ikaros Kappler
 * @date     2023-11-24 (plain Javascript)
 * @modified 2024-01-29 Ported to Typescript.
 * @version 1.0.0
 */
import { Polygon } from "../Polygon";
export declare const NGons: {
    ngon: (n: number, radius: number) => Polygon;
    nstar: (n: number, radiusA: number, radiusB: number) => Polygon;
};
