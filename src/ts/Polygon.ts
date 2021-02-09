/**
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-10-25 Added the scale function.
 * @modified 2019-11-06 JSDoc update.
 * @modified 2019-11-07 Added toCubicBezierPath(number) function.
 * @modified 2019-11-22 Added the rotate(number,Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-10-30 Added the `addVertex` function.
 * @modified 2020-10-31 Added the `getVertexAt` function.
 * @modified 2020-11-06 Added the `move` function.  
 * @modified 2020-11-10 Added the `getBounds` function.
 * @modified 2020-11-11 Generalized `move(Vertex)` to `move(XYCoords)`.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-01-29 Added the `signedArea` function (was global function in the demos before).
 * @modified 2021-01-29 Added the `isClockwise` function.
 * @modified 2021-01-29 Added the `area` function.
 * @modified 2021-01-29 Changed the param type for `containsVert` from Vertex to XYCoords.
 * @version 1.7.0
 *
 * @file Polygon
 * @public
 **/

import { BezierPath } from "./BezierPath";
import { Bounds } from "./Bounds";
import { UIDGenerator } from "./UIDGenerator";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable, UID } from "./interfaces";


/**
 * @classdesc A polygon class. Any polygon consists of an array of vertices; polygons can be open or closed.
 *
 * @requires BezierPath
 * @requires Bounds
 * @requires SVGSerializabe
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 * @requires XYCoords
 */
export class Polygon implements SVGSerializable {


    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "Polygon";

    
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof Polygon
     * @instance
     * @readonly 
     */
    readonly uid : UID;
    
    
    /** 
     * @member {Array<Vertex>} 
     * @memberof Polygon
     * @type {Array<Vertex>}
     * @instance
     */
    vertices:Array<Vertex>;


    /** 
     * @member {boolean} 
     * @memberof Polygon
     * @type {boolean}
     * @instance
     */
    isOpen:boolean;
    
    
    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    constructor( vertices?:Array<Vertex>, isOpen?:boolean ) {
	this.uid = UIDGenerator.next();
	if( typeof vertices == 'undefined' )
	    vertices = [];
	this.vertices = vertices;
	this.isOpen = isOpen;
    };


    /**
     * Add a vertex to the end of the `vertices` array.
     *
     * @method addVert
     * @param {Vertex} vert - The vertex to add.
     * @instance
     * @memberof Polygon
     **/
    addVertex( vert:Vertex ) : void {
	this.vertices.push( vert );
    };


    /**
     * Get the polygon vertex at the given position (index).
     *
     * The index may exceed the total vertex count, and will be wrapped around then (modulo).
     *
     * For k >= 0:
     *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
     *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
     *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
     *
     * @metho getVertexAt
     * @param {number} index - The index of the desired vertex.
     * @instance
     * @memberof Polygon
     * @return {Vertex} At the given index.
     **/
    getVertexAt( index:number ) : Vertex {
	if( index < 0 ) 
	    return this.vertices[ this.vertices.length - (Math.abs(index)%this.vertices.length) ];
	else
	    return this.vertices[ index % this.vertices.length ];
    };


    /**
     * Move the polygon's vertices by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this for chaining
     **/
    move( vert:XYCoords ) : Polygon {
	for( var i in this.vertices ) {
	    this.vertices[i].add( vert );
	}
	return this;
    };


    /**
     * Check if the given vertex is inside this polygon.<br>
     * <br>
     * Ray-casting algorithm found at<br>
     *    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
     *
     * @method containsVert
     * @param {XYCoords} vert - The vertex to check. The new x-component.
     * @return {boolean} True if the passed vertex is inside this polygon. The polygon is considered closed.
     * @instance
     * @memberof Polygon
     **/
    containsVert( vert:XYCoords ) : boolean {
	// ray-casting algorithm based on
	//    http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	var inside : boolean = false;
	for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            let xi : number = this.vertices[i].x, yi : number = this.vertices[i].y;
            let xj : number = this.vertices[j].x, yj : number = this.vertices[j].y;
    
            var intersect : boolean = ((yi > vert.y) != (yj > vert.y))
		&& (vert.x < (xj - xi) * (vert.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
	}
	return inside;
    };


    /**
     * Calculate the area of the given polygon (unsigned). 
     *
     * Note that this does not work for self-intersecting polygons.
     *
     * @method area
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    area() : number {
	return Polygon.utils.area(this.vertices);
    };


    /**
     * Calulate the signed polyon area by interpreting the polygon as a matrix
     * and calculating its determinant.
     *
     * @method signedArea
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    signedArea() : number {
	return Polygon.utils.signedArea(this.vertices)
    };


    /**
     * Get the winding order of this polgon: clockwise or counterclockwise.
     *
     * @method isClockwise
     * @instance
     * @memberof Polygon
     * @return {boolean}
     */
    isClockwise() : boolean {
	return Polygon.utils.signedArea(this.vertices) < 0;
    };
    
    

    /**
     * Scale the polygon relative to the given center.
     *
     * @method scale
     * @param {number} factor - The scale factor.
     * @param {Vertex} center - The center of scaling.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    scale( factor:number, center:Vertex ) : Polygon {
	for( var i in this.vertices ) {
	    if( typeof this.vertices[i].scale == 'function' ) 
		this.vertices[i].scale( factor, center );
	    else
		console.log( 'There seems to be a null vertex!', this.vertices[i] );
	}
	return this;
    };


    /**
     * Rotate the polygon around the given center.
     *
     * @method rotate
     * @param {number} angle  - The rotation angle.
     * @param {Vertex} center - The center of rotation.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this, for chaining.
     **/
    rotate( angle:number, center:Vertex ) : Polygon {
	for( var i in this.vertices ) {
	    this.vertices[i].rotate( angle, center );
	}
	return this;
    };


    /**
     * Get the bounding box (bounds) of this polygon.
     *
     * @method getBounds
     * @instance
     * @memberof Polygon
     * @return {Bounds} The rectangular bounds of this polygon.
     **/
    getBounds() : Bounds {
	return Bounds.computeFromVertices( this.vertices );
    };


    /**
     * Convert this polygon to a sequence of quadratic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are pairs of control-point-and-end-point:
     * <pre>startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint</pre>
     *
     * @method toQuadraticBezierData
     * @return {Vertex[]}  An array of 2d vertices that shape the quadratic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierData() : Array<Vertex> {
	if( this.vertices.length < 3 )
	    return [];
	var qbezier : Array<Vertex> = [];
	var cc0 : Vertex = this.vertices[0]; 
	var cc1 : Vertex = this.vertices[1]; 
	var edgeCenter : Vertex = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
					      cc0.y + (cc1.y-cc0.y)/2 );
	qbezier.push( edgeCenter );
	var limit = this.isOpen ? this.vertices.length : this.vertices.length+1;
	for( var t = 1; t < limit; t++ ) {  
	    cc0 = this.vertices[ t%this.vertices.length ];
	    cc1 = this.vertices[ (t+1)%this.vertices.length ];
	    var edgeCenter : Vertex = new Vertex( cc0.x + (cc1.x-cc0.x)/2,
						  cc0.y + (cc1.y-cc0.y)/2 );
	    qbezier.push( cc0 );
	    qbezier.push( edgeCenter );
	    cc0 = cc1;
	}
	return qbezier;
    };


    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierSVGString() : string {
	var qdata : Array<Vertex> = this.toQuadraticBezierData();
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=2 ) {
	    buffer.push( 'Q ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y );
	}
	return buffer.join(' ');
    };


    
    /**
     * Convert this polygon to a sequence of cubic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are triplets of (first-control-point, secnond-control-point, end-point):<br>
     * <pre>startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint</pre>
     *
     * @method toCubicBezierData
     * @param {number=} threshold - An optional threshold (default=1.0) how strong the curve segments 
     *                              should over-/under-drive. Should be between 0.0 and 1.0 for best 
     *                              results but other values are allowed.
     * @return {Vertex[]}  An array of 2d vertices that shape the cubic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierData( threshold:number|undefined ) : Array<Vertex> {
	if( typeof threshold == 'undefined' )
	    threshold = 1.0;
	
	if( this.vertices.length < 3 )
	    return [];
	var cbezier : Array<Vertex> = [];
	var a : Vertex = this.vertices[0]; 
	var b : Vertex = this.vertices[1]; 
	var edgeCenter = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	cbezier.push( edgeCenter );
	
	var limit : number = this.isOpen ? this.vertices.length-1 : this.vertices.length;
	for( var t = 0; t < limit; t++ ) {
	    var a = this.vertices[ t%this.vertices.length ];
	    var b = this.vertices[ (t+1)%this.vertices.length ];
	    var c = this.vertices[ (t+2)%this.vertices.length ];

	    var aCenter : Vertex = new Vertex( a.x + (b.x-a.x)/2,   a.y + (b.y-a.y)/2 );
	    var bCenter : Vertex = new Vertex( b.x + (c.x-b.x)/2,   b.y + (c.y-b.y)/2 );
	    
	    var a2 : Vertex = new Vertex( aCenter.x + (b.x-aCenter.x)*threshold, aCenter.y + (b.y-aCenter.y)*threshold );
	    var b0 : Vertex = new Vertex( bCenter.x + (b.x-bCenter.x)*threshold, bCenter.y + (b.y-bCenter.y)*threshold );

	    cbezier.push( a2 );
	    cbezier.push( b0 );
	    cbezier.push( bCenter );
	    
	}
	return cbezier;
	
    };


    
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierSVGString( threshold:number ) : string {
	var qdata : Array<Vertex> = this.toCubicBezierData( threshold );
	if( qdata.length == 0 )
	    return "";
	var buffer = [ 'M ' + qdata[0].x+' '+qdata[0].y ];
	for( var i = 1; i < qdata.length; i+=3 ) {
	    buffer.push( 'C ' + qdata[i].x+' '+qdata[i].y + ', ' + qdata[i+1].x+' '+qdata[i+1].y + ', ' + qdata[i+2].x + ' ' + qdata[i+2].y );
	}
	return buffer.join(' ');
    };

    

    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierPath( threshold:number ) : BezierPath {
	var qdata : Array<Vertex> = this.toCubicBezierData( threshold );
	// Conver the linear path vertices to a two-dimensional path array
	var pathdata : Array<Array<Vertex>> = [];
	for( var i = 0; i+3 < qdata.length; i+=3 ) {
	    pathdata.push( [ qdata[i], qdata[i+3], qdata[i+1], qdata[i+2] ] );
	}
	return BezierPath.fromArray( pathdata );
    };

 
    /**
     * Create an SVG representation of this polygon.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Polygon
     **/
    toSVGString( options:{ className? : string }|undefined ) : string {
	options = options || {};
	var buffer : Array<string> = [];
	buffer.push( '<path' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' d="' );
	if( this.vertices.length > 0 ) {
	    buffer.push( 'M ' );
	    buffer.push( this.vertices[0].x.toString() )
	    buffer.push( ' ' );
	    buffer.push( this.vertices[0].y.toString() );
	    for( var i = 1; i < this.vertices.length; i++ ) {
		buffer.push( ' L ' );
		buffer.push( this.vertices[i].x.toString() )
		buffer.push( ' ' );
		buffer.push( this.vertices[i].y.toString() );
	    }
	    if( !this.isOpen ) {
		buffer.push( ' Z' );
	    }
	}
	buffer.push( '" />' );
	return buffer.join('');
    };

    static utils = {

	/**
	 * Calculate the area of the given polygon (unsigned). 
	 *
	 * Note that this does not work for self-intersecting polygons.
	 *
	 * @name area
	 * @return {number}
	 */
	area( vertices : Array<XYCoords> ) : number {
	    // Found at:
	    //    https://stackoverflow.com/questions/16285134/calculating-polygon-area
	    let total : number = 0.0;
	    
	    for (var i = 0, l = vertices.length; i < l; i++) {
		const addX = vertices[i].x;
		const addY = vertices[(i + 1)%l].y;
		const subX = vertices[(i + 1)%l].x;
		const subY = vertices[i].y;

		total += (addX * addY * 0.5);
		total -= (subX * subY * 0.5);
	    }
	    return Math.abs(total);
	},


	/**
	 * Calulate the signed polyon area by interpreting the polygon as a matrix
	 * and calculating its determinant.
	 *
	 * @name signedArea
	 * @return {number}
	 */
	signedArea( vertices : Array<XYCoords> ) : number {
	    let sum : number = 0;
	    const n = vertices.length;
	    for (var i = 0; i < n; i++ ) {
		const j = (i+1) % n;
		sum += (vertices[j].x - vertices[i].x) * (vertices[i].y + vertices[j].y);
	    }
	    return sum;
	}
	
    };
    
}
