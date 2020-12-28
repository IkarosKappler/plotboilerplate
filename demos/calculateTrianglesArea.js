/**
 * Calculate the sum of all given triangles.
 * Each single triangle area is determined using Triangle.utils.area.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2020-12-28
 *
 * @name calculateTrianglesArea
 * @param {Array<Triangle>} triangles
 * @return number The sum of all triangles' areas.
 */

(function(context) {

    context.calculateTrianglesArea = function( triangles ) {
	var sum = 0.0;
	for( var i = 0; i < triangles.length; i++ ) {
	    // sum += Triangle.utils.signedArea( triangles[i].a.x, triangles[i].a.y, triangles[i].b.x, triangles[i].b.y, triangles[i].c.x, triangles[i].c.y );
	    sum += triangles[i].getArea();
	}
	return sum;
    };
    
})(globalThis || window);
