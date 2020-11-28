/**
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
 * @description The Convex Hull algorithm, found at RosettaCode:
 *
 * https://rosettacode.org/wiki/Convex_hull#JavaScript
 *
 * @requires XYCoords
 *
 * @global 
 * @name convexHull
 * @param {Array<XYCoords>} points - The points on the 2D plane to find the convex hull for.
 * @return {Array<XYCoords>} A ordered array of points defining the convex hull.
 **/
export const getConvexHull = (points:Array<XYCoords>) : Array<XYCoords> => {
    points.sort(comparison);
    const L : Array<XYCoords> = [];
    for (var i = 0; i < points.length; i++) {
        while (L.length >= 2 && cross(L[L.length - 2], L[L.length - 1], points[i]) <= 0) {
	    L.pop();
        }
        L.push(points[i]);
    }
    const U : Array<XYCoords> = [];
    for (var i = points.length - 1; i >= 0; i--) {
        while (U.length >= 2 && cross(U[U.length - 2], U[U.length - 1], points[i]) <= 0) {
	    U.pop();
        }
        U.push(points[i]);
    }
    L.pop();
    U.pop();
    return L.concat(U);
};


/**
 * Compare two vertices to create an order on the 2D plane.
 *
 * @name comparison
 * @private
 * @param {XYCoords} a - The first of the two points to compare.
 * @param {XYCoords} b - The second of the two points to compare.
 * @return {number} A number indicating the order (negative if `a` is 'smaller', 0 if both are equal, positive if `a` is 'larger').
 **/
const comparison = (a:XYCoords, b:XYCoords) : number => {
    return a.x == b.x ? a.y - b.y : a.x - b.x;
};


/**
 * Calculate the cross product of the three coordinates, interpreted as vectors.
 * 
 * @name cross
 * @private
 * @param {XYCoords} a
 * @param {XYCoords} b
 * @param {XYCoords} o
 * @return {number} The cross product of the three 'vectors'.
 **/
const cross = (a:XYCoords, b:XYCoords, o:XYCoords) : number => {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
};

