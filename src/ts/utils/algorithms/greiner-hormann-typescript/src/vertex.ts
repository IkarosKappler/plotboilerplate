/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file https://github.com/w8r/GreinerHormann/blob/master/src/vertex.js
 *
 * @date 2020-11-30
 */

import { IArrayVertex } from "./interfaces";
import Polygon from "./polygon";

/**
 * Vertex representation.
 */
export default class Vertex {

    /**
     * X coordinate
     * @type {Number}
     */
    public x : number;

    /**
     * Previous vertex
     * @type {Vertex}
     */
    public y : number;

    /**
     * Next node
     * @type {Vertex}
     */
    public next : Vertex | undefined

    /**
     * Previous vertex
     * @type {Vertex}
     */
    public prev : Vertex | undefined;

    /**
     * Corresponding intersection in other polygon
     */
    // TODO: type???
    public _corresponding : any | undefined;

    /**
     * Distance from previous
     */
    public _distance : number;

    /**
     * Entry/exit point in another polygon
     * @type {Boolean}
     */
    public _isEntry : boolean;

    /**
     * Intersection vertex flag
     * @type {Boolean}
     */
    public _isIntersection : boolean;

    /**
     * Loop check
     * @type {Boolean}
     */
    public _visited : boolean;

    
    /**
     * Construct a new vertex.
     *
     * @constructor
     * @param {Number|Array.<Number>} x
     * @param {Number=}               y
     */
    constructor (x:number|Vertex|IArrayVertex, y?:number) {
	if (arguments.length === 1) {
	    // Coords
	    if (Array.isArray(x)) {
		y = x[1];
		x = x[0];
	    } else if( typeof x.x !== "undefined" && typeof x.y !== "undefined" ) {
		y = x.y;
		x = x.x;
	    }
	}

	this.x = x;
	this.y = y;
	this.next = null;
	this.prev = null;
	this._corresponding = null;
	this._distance = 0.0;
	this._isEntry = true;
	this._isIntersection = false;
	this._visited = false;
    }; // END constructor


    /**
     * Creates intersection vertex
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} distance
     * @return {Vertex}
     */
    static createIntersection (x:number, y:number, distance:number) : Vertex {
	const vertex : Vertex = new Vertex(x, y);
	vertex._distance = distance;
	vertex._isIntersection = true;
	vertex._isEntry = false;
	return vertex;
    };


    /**
     * Mark as visited
     */
    visit () : void {
	this._visited = true;
	if (this._corresponding !== null && !this._corresponding._visited) {
            this._corresponding.visit();
	}
    };


    /**
     * Convenience
     * @param  {Vertex}  v
     * @return {Boolean}
     */
    equals(v:Vertex) : boolean {
	return this.x === v.x && this.y === v.y;
    };


    /**
     * Check if vertex is inside a polygon by odd-even rule:
     * If the number of intersections of a ray out of the point and polygon
     * segments is odd - the point is inside.
     * @param {Polygon} poly
     * @return {Boolean}
     */
    isInside (poly:Polygon) : boolean {
	let oddNodes = false;
	let vertex = poly.first;
	let next = vertex.next;
	const x = this.x;
	const y = this.y;

	do {
	    if ((vertex.y < y && next.y   >= y ||
		next.y < y && vertex.y >= y) &&
		(vertex.x <= x || next.x <= x)) {
		oddNodes ^= (vertex.x + (y - vertex.y) /
		    (next.y - vertex.y) * (next.x - vertex.x) < x);
	    }

	    vertex = vertex.next;
	    next = vertex.next || poly.first;
	} while (!vertex.equals(poly.first));

	return oddNodes;
    };
} // END class
