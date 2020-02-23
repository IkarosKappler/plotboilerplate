/**
 * @author  Ikaros Kappler
 * @date    2020-02-22
 * @version 1.0.0
 */

(function(_context) {

    var pbutils = _context.pbutils = _context.pbutils || {};
    pbutils.BezierPath = {};
    
    pbutils.BezierPath.toPolygon = function( path, density ) {
	if( typeof density != 'number' )
	    density = 0.05;
	// Each k pixels of arc length (depends on density)
	var length = path.getLength();
	var steps = Math.round( length*density );
	var verts = [], t;
	for( var i = 0; i <= steps; i++ ) {
	    t = i/steps;
	    verts.push( path.getPointAt( Math.max(0,Math.min(t,1) ) ) );
	}
	return new Polygon( verts, !path.adjustCircular ); // isOpen?
    };
    
})(window ? window : module.exports );
