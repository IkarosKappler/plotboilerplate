/**
 * @author Ikaros Kappler
 * @date   2020-11-29
 * @version 0.0.1-alpha
 **/

/**
 * Check if two polygons intersect.
 *
 * @name polygonsIntersect
 * @param {Polygon} polygonA
 * @param {Polygon} polygonB
 * @requires Polygon
 **/
(function(_context) {

    var polygonsIntersect = function( polygonA, polygonB ) {
	if( containsVerticesOf(polygonA,polygonB) )
	    return true;
	if( containsVerticesOf(polygonB,polygonA) )
	    return true;
	return false;
    }

    /**
     * Check if first polygon contains vertices of second polygon.
     */
    var containsVerticesOf = function( container, containee ) {

    };
    
    _context.polygonsIntersect = polygonsIntersect;
    
})(globalThis || window);
