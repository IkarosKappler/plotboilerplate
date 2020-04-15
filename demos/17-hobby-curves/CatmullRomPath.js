/**
 * For comparison I wanted to add a Catmull-Rom path.
 *
 * This demo implementation was inspired by this Codepen by Blake Bowen
 * https://codepen.io/osublake/pen/BowJed
 **/

(function() {

    var CatmullRomPath = function() {

	this.vertices = [];
	
    };

    CatmullRomPath.prototype.addPoint = function(p) {
	this.vertices.push( p );
    };

    /**
     *
     * @param {number=2} tension
     */
    CatmullRomPath.prototype.generateCurve = function( circular, tension ) {
	if( typeof tension == 'undefined' )
	    tension = 1.0;

	var points = [];
	for( var i = 0; i < this.vertices.length; i++ ) {
	    points.push( this.vertices[i].x );
	    points.push( this.vertices[i].y );
	} 
	
	return solve( this.vertices, circular, tension );	
    };
    
    // var tension = 1;

    //var poly = document.querySelector("polyline");
    //var path = document.querySelector("path");

    /* var points = [
	100,350,  
	200,100,
	300,350,
	400,150,
	500,350,
	600,200,
	700,350
    ]; */

    // poly.setAttribute("points", points);
    // path.setAttribute("d", solve(points, tension));

    function solve(data, circular, k) {
	var curves = [];	
	if (k == null) k = 1;	
	var size = data.length;
	//var last = size - 4;
	var last = size - 2;
	
	for (var i = 0; i < size - 1; i ++ ) {

	    var p0 = i ? data[i - 1] : data[0];
	    
	    var p1 = data[i + 0];

	    var p2 = data[i + 1];

	    var p3 = i !== last ? data[i + 2] : p2;
	    
	    var cp1 = new Vertex( p1.x + (p2.x - p0.x) / 6 * k, p1.y + (p2.y - p0.y) / 6 * k );

	    var cp2 = new Vertex( p2.x - (p3.x - p1.x) / 6 * k, p2.y - (p3.y - p1.y) / 6 * k );
	    
	    curves.push( new CubicBezierCurve( p1, p2, cp1, cp2 ) );
	    console.log( curves[curves.length-1] );
	} 
	// return path;
	return curves;
    } // END solve 

    /*
    function solve(data, k) {
	var curves = [];	
	if (k == null) k = 1;	
	var size = data.length;
	var last = size - 4;    
	// var path = "M" + [data[0], data[1]];

	for (var i = 0; i < size - 2; i +=2) {

	    var x0 = i ? data[i - 2] : data[0];
	    var y0 = i ? data[i - 1] : data[1];

	    var x1 = data[i + 0];
	    var y1 = data[i + 1];

	    var x2 = data[i + 2];
	    var y2 = data[i + 3];

	    var x3 = i !== last ? data[i + 4] : x2;
	    var y3 = i !== last ? data[i + 5] : y2;
	    
	    var cp1x = x1 + (x2 - x0) / 6 * k;
	    var cp1y = y1 + (y2 - y0) / 6 * k;

	    var cp2x = x2 - (x3 - x1) / 6 * k;
	    var cp2y = y2 - (y3 - y1) / 6 * k;
	    
	    // path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
	    // curves.push( new CubicBezierCurve( 
	} 
	// return path;
	return curves;
    }
    */

    window.CatmullRomPath = CatmullRomPath;

})();
