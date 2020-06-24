/**
 * @author  Ikaros Kappler
 * @date    2020-06-24
 * @version 1.0.0
 **/

var polyLineUtils = {

    /**
     * Get the length of the (unclosed) polyine.
     * 
     * @param {Vertex[]} polyLine - The polyline to use for interpolation.
     * @return {number}
     */
    polyLineLength : function(p) {
	var length = 0;
	for( var i = 0; i+1 < p.length; i++ ) {
	    length += p[i].distance( p[i+1] );
	}
	return length;
    },

    /**
     * Get the vertex on the line at the given absolute position 0 <= u <= length.
     * @param {Vertex[]} p - The polyline.
     * @param {number} u - The absolute position, beginning at 0.
     * @return {Vertex}
     **/
    getVertAtPolyLine : function( p, u ) {
	var i = 0;
	var accu = 0.0;
	var tmp;
	while( i+1 < p.length && (tmp=accu+p[i].distance(p[i+1])) < u ) {
	    accu = tmp;
	    i++;
	}
	// Interpolate on linear segment
	var t = (u-accu) / p[i].distance( p[i+1] );
	return new Vertex( p[i].x + (p[i+1].x-p[i].x)*t );
    },

    /**
     * Change the vertex count on a polyline by interpolation.
     * 
     * @param {Vertex[]} polyLine - The polyline to use for interpolation.
     * @param {number} vertexCount - The desired new vertex count. The new polyline will result in vertexCount-1 segments.
     * @return {Vertex[]}
     */
    interpolate : function( polyLine, vertexCount ) {
	if( vertexCount < 2 )
	    throw "Polyline interpolation is not possible with less than two points.";
	var polyLineLength = polyLineUtils.polyLineLength(polyLine);
	var result = [];
	for( var i = 0; i < vertexCount; i++ ) {
	    var t = i/(vertexCount-1);
	    var u = t * polyLineLength;
	    result.push( polyLineUtils.getVertAtPolyLine(polyLine,u) );
	}
	return result;
    }
};

