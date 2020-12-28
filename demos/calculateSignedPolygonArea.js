/**
 * Calulate the signed polyon area by interpreting the polygon as a matrix
 * and calculating its determinant.
 *
 * @date 2020-12-28
 */

/**
 * @param {XYCoords[]} vertices
 * @return {number}
 */
var calculateSignedPolygonArea = function( vertices ) {
    var sum = 0;
    for (var i = 0; i < vertices.length; i++ ) {
	var j = (i+1) % vertices.length;
	sum += (vertices[j].x - vertices[i].x) * (vertices[i].y + vertices[j].y);
    }
    return sum;
};
