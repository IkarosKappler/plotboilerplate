/**
 * The Sutherland-Hodgman convex polygon clipping algorithm.
 *
 * Original version:
 *    https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 *
 * @author  Ikaros Kappler (ported to TypeScript with {x,y} vertices).
 * @date    2021-01-29
 * @version 1.0.0
 */
import { XYCoords } from "../../interfaces";
/**
 * @param {Array<XYCoords>} subjectPolygon - Can be any polygon.
 * @param {Array<XYCoords>} clipPolygon - Must be convex.
 */
export declare const sutherlandHodgman: (subjectPolygon: Array<XYCoords>, clipPolygon: Array<XYCoords>) => Array<XYCoords>;
