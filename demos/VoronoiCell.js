/**
 * @classdesc A simple voronoi cell (part of a voronoi diagram), stored as an array of 
 * adjacent triangles.
 *
 * @requires Triangle, Polygon, Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-04-11
 * @modified 2018-05-04 Added the 'sharedVertex' param to the constructor. Extended open cells into 'infinity'.
 * @modified 2019-10-25 Fixed a serious bug in the toPathArray function; cell with only one vertex (extreme cases) returned invalid arrays which broke the rendering. 
 * @modified 2019-12-09 Removed an unnecesary if-condition from the _calculateOpenEdgePoint(...) helper function.
 * @modofied 2020-05-18 Added function VoronoiCell.toPolygon().
 * @version  1.1.0
 *
 * @file VoronoiCell
 * @public
 **/

(function(context) {
    "strict mode";
    
    /**
     * The constructor.
     *
     * @param {Triangle[]} triangles    The passed triangle array must contain an ordered sequence of
     *                                  adjacent triangles.
     * @param {Vertex}     sharedVertex This is the 'center' of the voronoi cell; all triangles must share
     *                                  that vertex.
     **/
    context.VoronoiCell = function( triangles, sharedVertex ) {
	if( typeof triangles == 'undefined' )
	    triangles = [];
	if( typeof sharedVertex == 'undefined' )
	    sharedVertex = new Vertex(0,0);
	this.triangles = triangles;
	this.sharedVertex = sharedVertex;
    };

    
    /**
     * Check if the first and the last triangle in the path are NOT connected.
     *
     * @return {boolean}
     **/
    context.VoronoiCell.prototype.isOpen = function() {
	// There must be at least three triangles
	return this.triangles.length < 3 || !this.triangles[0].isAdjacent(this.triangles[this.triangles.length-1]);	   
    };

    /**
     * Convert this Voronoi cell to a path polygon, consisting of all Voronoi cell corner points.
     *
     * Note that open Voronoi cell cannot properly converted to Polygons as they are considered
     * infinite. 'Open' Voronoi edges will be cut off at their innermose vertices.
     *
     * @return {Polygon} 
     **/
    context.VoronoiCell.prototype.toPolygon = function() {
	return new Polygon( this.toPathArray(), this.isOpen() );
    };

    /**
     * Convert the voronoi cell path data to an SVG polygon data string.
     *
     * "x0,y0 x1,y1 x2,y2 ..." 
     *
     * @return {string}
     **/
    context.VoronoiCell.prototype.toPathSVGString = function() {
	if( this.triangles.length == 0 )
	    return "";	
	var arr = this.toPathArray();
	return arr.map( function(vert) { return ''+vert.x+','+vert.y; } ).join(' '); 
    };


    /**
     * Convert the voronoi cell path data to an array.
     *
     * [vertex0, vertex1, vertex2, ... ] 
     *
     * @return {Vertex[]}
     **/
    context.VoronoiCell.prototype.toPathArray = function() {	
	if( this.triangles.length == 0 )
	    return [];
	if( this.triangles.length == 1 )
	    return [ this.triangles[0].getCircumcircle().center ];
	
	var arr = [];

	// Working for path begin
	if( false && this.isOpen() ) 
	    arr.push( _calcOpenEdgePoint( this.triangles[0], this.triangles[1], this.sharedVertex ) );
	
	for( var t = 0; t < this.triangles.length; t++ ) {
	    var cc = this.triangles[t].getCircumcircle();
	    arr.push( cc.center );
	}

	// Urgh, this is not working right now.
	if( false && this.isOpen() ) 
	    arr.push( _calcOpenEdgePoint( this.triangles[ this.triangles.length-1 ], this.triangles[ this.triangles.length-2 ], this.sharedVertex ) );
	
	
	return arr;
    }

    

    /**
     * A helper function.
     *  
     * Calculate the 'infinite' open edge point based on the open path triangle
     * 'tri' and its neighbour 'neigh'.
     *
     * This function is used to determine outer hull points.
     *
     * @return {Vertex}
     **/
    var _calcOpenEdgePoint = function( tri, neigh, sharedVertex ) {
	var center  = tri.getCircumcircle().center;
	// Find non-adjacent edge (=outer edge)
	var edgePoint = _findOuterEdgePoint( tri, neigh, sharedVertex );
	var perpendicular = _perpendicularLinePoint( sharedVertex, edgePoint, center );
	var openEdgePoint = null;
	// It is not necesary to make a difference on the determinant here
	openEdgePoint = new Vertex( perpendicular.x + (center.x-perpendicular.x)*1000,
				    perpendicular.y + (center.y-perpendicular.y)*1000 );
	return openEdgePoint;
    };
    
    /**
     * A helper function.
     *
     * Find the outer (not adjacent) vertex in triangle 'tri' which has triangle 'neighbour'.
     *
     * This function is used to determine outer hull points.
     *
     * @return {Vertex}
     **/
    var _findOuterEdgePoint = function( tri, neighbour, sharedVertex ) {
	if( tri.a.equals(sharedVertex) ) {
	    if( neighbour.a.equals(tri.b) || neighbour.b.equals(tri.b) || neighbour.c.equals(tri.b) ) return tri.c;
	    else return tri.b;
	}
	if( tri.b.equals(sharedVertex) ) {
	    if( neighbour.a.equals(tri.a) || neighbour.b.equals(tri.a) || neighbour.c.equals(tri.a) ) return tri.c;
	    else return tri.a;
	}
	// Here:
	//    tri.c.equals(sharedVertex) 
	if( neighbour.a.equals(tri.a) || neighbour.b.equals(tri.a) || neighbour.c.equals(tri.a) ) return tri.b;
	else return tri.a;
    };


    /**
     * A helper function.
     **/
    var _perpendicularLinePoint = function( lineA, lineB, point ) {
	// Found at
	//    https://stackoverflow.com/questions/1811549/perpendicular-on-a-line-from-a-given-point?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
	// first convert line to normalized unit vector
	// double dx = x2 - x1;
	// double dy = y2 - y1;
	// double mag = sqrt(dx*dx + dy*dy);
	// dx /= mag;
	// dy /= mag;
	// 
	// translate the point and get the dot product
	// double lambda = (dx * (x3 - x1)) + (dy * (y3 - y1));
	// x4 = (dx * lambda) + x1;
	// y4 = (dy * lambda) + y1;

	// first convert line to normalized unit vector
	var dx = lineB.x - lineA.x;
	var dy = lineB.y - lineA.y;
	var mag = Math.sqrt(dx*dx + dy*dy);
	dx /= mag;
	dy /= mag;

	// translate the point and get the dot product
	var lambda = (dx * (point.x - lineA.x)) + (dy * (point.y - lineA.y));
	x4 = (dx * lambda) + lineA.x;
	y4 = (dy * lambda) + lineA.y;
	return new Vertex(x4,y4);
    }
    
    
})(window ? window : module.export);
