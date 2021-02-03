/**
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2018-12-05 Refactored the code from the morley-triangle script.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-28 Fixed a bug in the Line.sub( Vertex ) function (was not working).
 * @modified 2019-09-02 Added the Line.add( Vertex ) function.
 * @modified 2019-09-02 Added the Line.denominator( Line ) function.
 * @modified 2019-09-02 Added the Line.colinear( Line ) function.
 * @modified 2019-09-02 Fixed an error in the Line.intersection( Line ) function (class Point was renamed to Vertex).
 * @modified 2019-12-15 Added the Line.moveTo(Vertex) function.
 * @modified 2020-03-16 The Line.angle(Line) parameter is now optional. The baseline (x-axis) will be used if not defined.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-12-04 The `intersection` function returns undefined if both lines are parallel.
 * @version  2.1.3
 *
 * @file Line
 * @public
 **/

import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable} from "./interfaces";


/**
 * @classdesc A line consists of two vertices a and b.<br>
 * <br>
 * This is some refactored code from my 'Morley Triangle' test<br>
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @requires Vertex
 */
export class Line
    extends VertTuple<Line>
    implements SVGSerializable {

	/**
	 * Required to generate proper CSS classes and other class related IDs.
	 **/
	readonly className : string = "Line";
	
	
	/**
	 * Creates an instance of Line.
	 *
	 * @constructor
	 * @name Line
	 * @param {Vertex} a The line's first point.
	 * @param {Vertex} b The line's second point.
	 **/
	constructor(a:Vertex,b:Vertex) {
	    super(a,b,(a:Vertex,b:Vertex)=>new Line(a,b));
	}
	

	/**
	 * Get the intersection if this line and the specified line.
	 *
	 * @method intersection
	 * @param {Line} line The second line.
	 * @return {Vertex|undefined} The intersection (may lie outside the end-points) or `undefined` if both lines are parallel.
	 * @instance
	 * @memberof Line
	 **/
	// !!! DO NOT MOVE TO VertTuple
	intersection( line:Line ):Vertex|undefined {
	    const denominator : number = this.denominator(line);
	    if( denominator == 0 ) 
		return null;
	    
	    let a : number = this.a.y - line.a.y; 
	    let b : number = this.a.x - line.a.x; 
	    const numerator1 : number = ((line.b.x - line.a.x) * a) - ((line.b.y - line.a.y) * b);
	    const numerator2 : number = ((this.b.x - this.a.x) * a) - ((this.b.y - this.a.y) * b);
	    a = numerator1 / denominator; // NaN if parallel lines
	    b = numerator2 / denominator;

	    // Catch NaN?
	    const x : number = this.a.x + (a * (this.b.x - this.a.x));
	    const y : number = this.a.y + (a * (this.b.y - this.a.y));

	    if( isNaN(a) || isNaN(x) || isNaN(y) ) {
		return undefined;
	    }
	    
	    // if we cast these lines infinitely in both directions, they intersect here:
	    return new Vertex( x, y );
	};
	

	/**
	 * Create an SVG representation of this line.
	 *
	 * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
	 * @method toSVGString
	 * @param {options} p - A set of options, like the 'classname' to use 
	 *                      for the line object.
	 * @return {string} The SVG string representing this line.
	 * @instance
	 * @memberof Line
	 **/
	toSVGString( options:{ className?: string } ):string {
	    options = options || {};
	    var buffer = [];
	    buffer.push( '<line' );
	    if( options.className )
		buffer.push( ' class="' + options.className + '"' );
	    buffer.push( ' x1="' + this.a.x + '"' );
	    buffer.push( ' y1="' + this.a.y + '"' );
	    buffer.push( ' x2="' + this.b.x + '"' );
	    buffer.push( ' y2="' + this.b.y + '"' );
	    buffer.push( ' />' );
	    return buffer.join('');
	};
    }
