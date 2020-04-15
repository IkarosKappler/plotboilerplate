/**
 * For comparison I wanted to add a Catmull-Rom path.
 *
 * This demo implementation was inspired by this Codepen by Blake Bowen
 * https://codepen.io/osublake/pen/BowJed
 *
 * @date 2020-04-15
 * Converted to a class by Ikaros Kappler
 **/

(function() {

    var CatmullRomPath = function() {

	this.vertices = [];
	
    };

    CatmullRomPath.prototype.addPoint = function(p) {
	this.vertices.push( p );
    };

    /**
     * Generate the path (an array of curves) from the vertices.
     *
     * @param {boolean} circular
     * @param {number=1} tension
     * @return {Array<CubicBezierCurve>}
     */
    CatmullRomPath.prototype.generateCurve = function( circular, tension ) {
	if( typeof tension == 'undefined' )
	    tension = 1.0;

	if( circular )
	    return solveClosed( this.vertices, tension );
	else
	    return solveOpen( this.vertices, tension );	
    };
     
    function solveOpen(data, k) {
	var curves = [];	
	if (k == null) k = 1;	
	var size = data.length;
	var last = size - 2;
	for (var i = 0; i < size - 1; i ++ ) {
	    var p0 = i ? data[i - 1] : data[0];	    
	    var p1 = data[i + 0];
	    var p2 = data[i + 1];
	    var p3 = i !== last ? data[i + 2] : p2;	    
	    var cp1 = new Vertex( p1.x + (p2.x - p0.x) / 6 * k, p1.y + (p2.y - p0.y) / 6 * k );
	    var cp2 = new Vertex( p2.x - (p3.x - p1.x) / 6 * k, p2.y - (p3.y - p1.y) / 6 * k );	    
	    curves.push( new CubicBezierCurve( p1, p2, cp1, cp2 ) );
	} 
	return curves;
    } // END solveOpen

    function solveClosed(data, k) {
	var curves = [];	
	if (k == null) k = 1;	
	var size = data.length;
	var last = size - 1;
	
	for (var i = 0; i < size; i ++ ) {
	    var p0 = i ? data[i - 1] : data[last];	    
	    var p1 = data[i + 0];
	    var p2 = data[(i + 1) % size];
	    var p3 = data[(i + 2) % size];	    
	    var cp1 = new Vertex( p1.x + (p2.x - p0.x) / 6 * k, p1.y + (p2.y - p0.y) / 6 * k );
	    var cp2 = new Vertex( p2.x - (p3.x - p1.x) / 6 * k, p2.y - (p3.y - p1.y) / 6 * k );	    
	    curves.push( new CubicBezierCurve( p1, p2, cp1, cp2 ) );
	} 
	return curves;
    } // END solveClosed

    window.CatmullRomPath = CatmullRomPath;

})();
