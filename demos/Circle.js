/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Vertex
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2020-05-04
 **/

(function() {

    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    var Circle = function( center, radius ) {
	this.center = center;
	this.radius = radius;
    };


    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned 
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value 
     *   will be max inner distance and it will be negative.
     *
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     */
    Circle.prototype.lineDistance = function( line ) {
	var closestPointOnLine = line.getClosestPoint( this.center );
	return closestPointOnLine.distance( this.center ) - this.radius;
    };

    window.Circle = Circle;
    
})(window);
