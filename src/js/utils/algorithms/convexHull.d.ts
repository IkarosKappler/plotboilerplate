/**
 * @description The Convex Hull algorithm, found at RosettaCode:
 *
 * https://rosettacode.org/wiki/Convex_hull#JavaScript
 *
 * @requires XYCoords
 *
 * @author   Rosettcode, rewritten and ported to TypeScript by Ikaros Kappler
 * @date     2020-05-04
 * @modified 2020-08-17 Ported this function from vanilla JS to TypeScript.
 * @version  1.0.1
 *
 * @file convexHull
 * @public
 **/
import { XYCoords } from "../../interfaces";
/**
 * @global
 * @name convexHull
 * @param {Array<XYCoords>} points - The points on the 2D plane to find the convex hull for.
 * @return {Array<XYCoords>} A ordered array of points defining the convex hull.
 **/
export declare const getConvexHull: (points: Array<XYCoords>) => Array<XYCoords>;
