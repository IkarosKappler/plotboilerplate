/**
 * @author   Ikaros Kappler (ported from basic script to class).
 * @date     2020-04-15
 * @modified 2020-08-19 Ported this class from vanilla JS to TypeScript.
 * @version  1.0.0
 *
 * @file CubicSplinePath
 * @public
 **/

import { CubicBezierCurve } from "../../CubicBezierCurve";
import { HobbyPath } from "./HobbyPath";
import { Vertex } from "../../Vertex";

interface IControlCoords {
    start : Array<number>;
    end : Array<number>;
};



/**
 * @classdesc Compute a natural cubic Bézier spline path from a given sequence of points/vertices.
 * 
 * Inspired by http://weitz.de/hobby/
 *
 * @requires CubicBezierCurve
 * @requires HobbyPath
 * @requires Vertex
 */
export class CubicSplinePath {

    /**
     * @member {Array<Vertex>} vertices
     * @memberof CatmullRomPath
     * @type {Array<Vertex>}
     * @instance
     **/
    private vertices : Array<Vertex>;

    
    /**
     * @constructor
     * @name CubicSplinePath
     * @param {Array<Vertex>=} vertices? - An optional array of vertices to initialize the path with.
     **/
    constructor( vertices?: Array<Vertex> ) {
	this.vertices = vertices ? vertices : [];
    };


     /**
     * Add a new point to the end of the vertex sequence.
     *
     * @name addPoint
     * @memberof CubicSplinePath
     * @instance
     * @param {Vertex} p - The vertex (point) to add.
     **/
    addPoint ( p: Vertex ) {
	this.vertices.push( p );
    };

    /**
     * Generate a sequence of cubic Bézier curves from the point set.
     *
     * @name generateCurve
     * @memberof CubicSplinePath
     * @instance
     * @param {boolean=} circular - Specify if the path should be closed.
     * @return Array<CubicBezierCurve>
     **/
    generateCurve ( circular?:boolean ) : Array<CubicBezierCurve> {
	const xs : Array<number> = [];
	const ys : Array<number> = [];
	for( var i = 0; i < this.vertices.length; i++ ) {
	    xs.push( this.vertices[i].x );
	    ys.push( this.vertices[i].y );
	}
	const curves : Array<CubicBezierCurve> = [];
	
	let n : number = this.vertices.length; 
	if (n > 1) {
	    if (n == 2) {
		// for two points, just draw a straight line
		curves.push( new CubicBezierCurve( this.vertices[0], this.vertices[1], this.vertices[0], this.vertices[1] ) );
	    } else {
		if (!circular ) {
		    // open curve
		    // x1 and y1 contain the coordinates of the first control
		    // points, x2 and y2 those of the second
		    const controlsX : IControlCoords = CubicSplinePath.utils.naturalControlsOpen(xs);
		    const controlsY : IControlCoords = CubicSplinePath.utils.naturalControlsOpen(ys);
		    for (let i = 1; i < n; i++) {
			// add Bézier segment - two control points and next node
			curves.push( new CubicBezierCurve( this.vertices[i-1],
							   this.vertices[i],
							   new Vertex(controlsX.start[i-1], controlsY.start[i-1]), // x1[i-1], y1[i-1]), // new Vertex(x1[i-1], y1[i-1]),
							   new Vertex(controlsX.end[i-1], controlsY.end[i-1])  // new Vertex(x2[i-1], y2[i-1])
							 ) )
		    }
		} else {
		    // closed curve, i.e. endpoints are connected
		    // see comments for open curve
		    let controlsX : IControlCoords = CubicSplinePath.utils.naturalControlsClosed(xs);
		    let controlsY : IControlCoords = CubicSplinePath.utils.naturalControlsClosed(ys);
		    for (let i = 0; i < n; i++) {
			// if i is n-1, the "next" point is the first one
			let j = (i+1) % n;
			curves.push( new CubicBezierCurve( this.vertices[i],
							   this.vertices[j],
							   new Vertex(controlsX.start[i], controlsY.start[i]), // new Vertex(x1[i], y1[i]),
							   new Vertex(controlsX.end[i], controlsY.end[i])  // new Vertex(x2[i], y2[i])
							 ) )
		    }
		}
	    }
	}

	return curves;
    };


    static utils = {
	naturalControlsClosed : ( coords:Array<number> ) : IControlCoords => {
	    const n : number = coords.length;
	    // a, b, and c are the diagonals of the tridiagonal matrix, d is the
	    // right side
	    const a : Array<number> = new Array<number>(n);
	    const b : Array<number> = new Array<number>(n);
	    const c : Array<number> = new Array<number>(n);
	    const d : Array<number> = new Array<number>(n);
	    // the video explains why the matrix is filled this way
	    b[0] = 4;
	    c[0] = 1;
	    d[0] = 4*coords[0] + 2*coords[1];
	    a[n-1] = 1;
	    b[n-1] = 4;
	    d[n-1] = 4*coords[n-1] + 2*coords[0];
	    for (let i = 1; i < n-1; i++) {
		a[i] = 1;
		b[i] = 4;
		c[i] = 1;
		d[i] = 4*coords[i] + 2*coords[i+1];
	    }
	    // add a one to the two empty corners and solve the system for the
	    // first control points
	    const x1 : Array<number> = HobbyPath.utils.sherman(a, b, c, d, 1, 1);
	    // compute second controls points from first
	    const x2 : Array<number> = new Array<number>(n);
	    for (let i = 0; i < n-1; i++)
		x2[i] = 2*coords[i+1] - x1[i+1];
	    x2[n-1] = 2*coords[0] - x1[0];
	    return { start : x1, end : x2 };
	},


	// computes two arrays for the first and second controls points for a
	// natural cubic spline through the points in K, an "open" curve where
	// the curve doesn't return to the starting point; the function works
	// with one coordinate at a time, i.e. it has to be called twice
	naturalControlsOpen : ( coords: Array<number> ) : IControlCoords => {
	    const n : number = coords.length - 1;
	    // a, b, and c are the diagonals of the tridiagonal matrix, d is the
	    // right side
	    const a : Array<number> = new Array<number>(n);
	    const b : Array<number> = new Array<number>(n);
	    const c : Array<number> = new Array<number>(n);
	    const d : Array<number> = new Array<number>(n);
	    // the video explains why the matrix is filled this way
	    b[0] = 2;
	    c[0] = 1;
	    d[0] = coords[0] + 2*coords[1];
	    a[n-1] = 2;
	    b[n-1] = 7;
	    d[n-1] = 8*coords[n-1] + coords[n];
	    for (let i = 1; i < n-1; i++) {
		a[i] = 1;
		b[i] = 4;
		c[i] = 1;
		d[i] = 4*coords[i] + 2*coords[i+1];
	    }
	    // solve the system to get the first control points
	    const x1 : Array<number> = HobbyPath.utils.thomas(a, b, c, d);
	    // compute second controls points from first
	    const x2 : Array<number> = new Array<number>(n);
	    for (let i = 0; i < n-1; i++) {
		x2[i] = 2*coords[i+1] - x1[i+1];
	    }
	    x2[n-1] = (coords[n] + x1[n-1]) / 2;
	    return { start : x1, end : x2 }; 
	}
    }; // END utils
}; // END class
