/**
 * A simple line class based on two vertices a and b.
 *
 * This is some refactored code from my 'Morley Triangle' test
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2018-12-05 Refactored the code from the morley-triangle script.
 * @version  2.0.0
 **/

(function(_context) {

    // +------------------------------------------------------------
    // | Line class
    // |
    // | @param a:Vertex The line's first point.
    // | @param b:Vertex The line's second point.
    // +------------------------------------------------------------
    var Line = function( a, b ) {
	this.a = a;
	this.b = b;
    };

    
    Line.prototype.length = function() {
	return Math.sqrt( Math.pow(this.b.x-this.a.x,2) + Math.pow(this.b.y-this.a.y,2) );
    };

    Line.prototype.sub = function( point ) {
	return new Line( this.a.sub(point), this.b.sub(point) );
    };

    Line.prototype.normalize = function() {
	this.b.set( this.a.x + (this.b.x-this.a.x)/this.length(),
		    this.a.y + (this.b.y-this.a.y)/this.length() );
    }; 

    Line.prototype.scale = function( factor ) {
	this.b.set( this.a.x + (this.b.x-this.a.x)*factor,
		    this.a.y + (this.b.y-this.a.y)*factor );
    };
    
    // Get the angle between this and the passed line (in radians)
    Line.prototype.angle = function( line ) {	
	// Compute the angle from x axis and the return the difference :)
	var v0 = this.b.clone().sub( this.a );
	var v1 = line.b.clone().sub( line.a );
	// Thank you, Javascript, for this second atan function. No additional math is needed here!
	// The result might be negative, but isn't it usually nicer to determine angles in positive values only?
	return Math.atan2( v1.x, v1.y ) - Math.atan2( v0.x, v0.y );
    };
    
    /**
     * Get line point at position t in [0 ... 1]:
     *  [P(0)]=[A]--------------------[P(t)]------[B]=[P(1)]
     **/
    Line.prototype.vertAt = function( t ) {
	return new Vertex( this.a.x + (this.b.x-this.a.x)*t,
			  this.a.y + (this.b.y-this.a.y)*t );
    };
	    

    Line.prototype.intersection = function( line ) {
	//  http://jsfiddle.net/justin_c_rounds/Gd2S2/
	var denominator = ((line.b.y - line.a.y) * (this.b.x - this.a.x)) - ((line.b.x - line.a.x) * (this.b.y - this.a.y));
	if( denominator == 0 ) 
	    return null;
	
	var a = this.a.y - line.a.y; 
	var b = this.a.x - line.a.x; 
	var numerator1 = ((line.b.x - line.a.x) * a) - ((line.b.y - line.a.y) * b);
	var numerator2 = ((this.b.x - this.a.x) * a) - ((this.b.y - this.a.y) * b);
	a = numerator1 / denominator; // NaN if parallel lines
	b = numerator2 / denominator;
	
	// if we cast these lines infinitely in both directions, they intersect here:
	return new Point( this.a.x + (a * (this.b.x - this.a.x)),
			  this.a.y + (a * (this.b.y - this.a.y)) );
    };


    // +---------------------------------------------------------------------------------
    // | Create an SVG representation of this line.
    // |
    // | @return string The SVG string
    // +-------------------------------
    Line.prototype.toSVGString = function( options ) {
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


    Line.prototype.getClosestLineT = function( p ) {
	var l2 = Line.util.dist2(this.a, this.b);
	if( l2 === 0 ) return 0; // dist2(p, v);
	//var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
	// t = Math.max(0, Math.min(1, t));
	return t;
    };
    
    Line.prototype.pointDistance = function( p ) {
	// Taken From:
	// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

	function dist2(v, w) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	function distToSegmentSquared (p, v, w) {
	    //var l2 = dist2(v, w);
	    //if( l2 === 0 ) return dist2(p, v);
	    //var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	    //t = Math.max(0, Math.min(1, t));
	    return dist2(p, this.vertAt(this.getClosestLineT(p))); // dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	//function distToSegment (p, v, w) {
	//    return Math.sqrt(distToSegmentSquared(p, v, w));
	//}

	return Math.sqrt( distToSegmentSquared(p, this.a, this.b) );
    }
    
    
    this.toString = function() {
	return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    };

    Line.util = {
	dist2 : function(v, w) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}
    };

    _context.Line = Line;

})(window ? window : module.export);
