/**
 * The earcut polygon algorithm has problems handling multiple colinear
 * intersection polygon vertices on a horizontal line.
 *
 * Adding a _tiny_ jitter avoids the error of detecting too large
 * intersection polygons. This is more a dirty workaround, not a real
 * correct numeric solution.
 *
 * @author
 * @date 2020-12-20
 */

/**
 * @param {Array<Vertex>} vertices - The polygon
 * @param {number?=0.00001} epsilon - The max jitter value for each component (x and y).
 */
var addPolygonJitter = function( vertices, epsilon ) {
    if( typeof epsilon === "undefined" )
	epsilon = 0.00001;

    for( var i = 0; i < vertices.length; i++ ) {
	vertices[i].x += Math.random()*epsilon;
	vertices[i].y += Math.random()*epsilon;
    }
    return vertices;
};
