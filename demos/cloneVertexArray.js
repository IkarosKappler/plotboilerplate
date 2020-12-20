/**
 * The name says it.
 * 
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2020-12-20
 */

var cloneVertexArray = function( vertices ) {
    var result = []; // Array(vertices.length);
    for( var i = 0; i < vertices.length; i++ ) {
	result.push( new Vertex(vertices[i].x, vertices[i].y) );
    }
    return result;
};
