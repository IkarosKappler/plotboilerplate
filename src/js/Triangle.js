"use strict";
/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might
 * contain some strange and unexpected functions.
 *
 * @requires Vertex, Polygon, SVGSerializale
 *
 *
 * @author    Ikaros Kappler
 * @date_init 2012-10-17 (Wrote a first version of this in that year).
 * @date      2018-04-03 (Refactored the code into a new class).
 * @modified  2018-04-28 Added some documentation.
 * @modified  2019-09-11 Added the scaleToCentroid(Number) function (used by the walking triangle demo).
 * @modified  2019-09-12 Added beautiful JSDoc compliable comments.
 * @modified  2019-11-07 Added to toSVG(options) function to make Triangles renderable as SVG.
 * @modified  2019-12-09 Fixed the determinant() function. The calculation was just wrong.
 * @modified  2020-03-16 (Corona times) Added the 'fromArray' function.
 * @modified  2020-03-17 Added the Triangle.toPolygon() function.
 * @modified  2020-03-17 Added proper JSDoc comments.
 * @modified  2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified  2020-05-09 Added the new Circle class (ported to Typescript from the demos).
 * @modified  2020-05-12 Added getIncircularTriangle() function.
 * @modified  2020-05-12 Added getIncircle() function.
 * @modified  2020-05-12 Fixed the signature of getCircumcirle(). Was still a generic object.
 * @version   2.2.4
 *
 * @file Triangle
 * @fileoverview A simple triangle class: three vertices.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds_1 = require("./Bounds");
var Circle_1 = require("./Circle");
var Line_1 = require("./Line");
var Polygon_1 = require("./Polygon");
var Vertex_1 = require("./Vertex");
var geomutils_1 = require("./geomutils");
var Triangle = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Triangle
     * @param {Vertex} a - The first vertex of the triangle.
     * @param {Vertex} b - The second vertex of the triangle.
     * @param {Vertex} c - The third vertex of the triangle.
     **/
    function Triangle(a, b, c) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Triangle";
        this.a = a;
        this.b = b;
        this.c = c;
        this.calcCircumcircle();
    }
    /**
     * Create a new triangle from the given array of vertices.
     *
     * The array must have at least three vertices, otherwise an error will be raised.
     * This function will not create copies of the vertices.
     *
     * @method fromArray
     * @static
     * @param {Array<Vertex>} arr - The required array with at least three vertices.
     * @memberof Vertex
     * @return {Triangle}
     **/
    Triangle.fromArray = function (arr) {
        //if( !Array.isArray(arr) )
        //    throw new Exception("Cannot create triangle fromArray from non-array.");
        if (arr.length < 3)
            throw "Cannot create triangle from array with less than three vertices (" + arr.length + ")";
        return new Triangle(arr[0], arr[1], arr[2]);
    };
    ;
    /**
     * Get the centroid of this triangle.
     *
     * The centroid is the average midpoint for each side.
     *
     * @method getCentroid
     * @return {Vertex} The centroid
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.getCentroid = function () {
        return new Vertex_1.Vertex((this.a.x + this.b.x + this.c.x) / 3, (this.a.y + this.b.y + this.c.y) / 3);
    };
    ;
    /**
     * Scale the triangle towards its centroid.
     *
     * @method scaleToCentroid
     * @param {number} - The scale factor to use. That can be any scalar.
     * @return {Triangle} this (for chaining)
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.scaleToCentroid = function (factor) {
        var centroid = this.getCentroid();
        this.a.scale(factor, centroid);
        this.b.scale(factor, centroid);
        this.c.scale(factor, centroid);
        return this;
    };
    ;
    /**
     * Get the circumcircle of this triangle.
     *
     * The circumcircle is that unique circle on which all three
     * vertices of this triangle are located on.
     *
     * Please note that for performance reasons any changes to vertices will not reflect in changes
     * of the circumcircle (center or radius). Please call the calcCirumcircle() function
     * after triangle vertex changes.
     *
     * @method getCircumcircle
     * @return {Object} - { center:Vertex, radius:float }
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.getCircumcircle = function () {
        if (!this.center || !this.radius)
            this.calcCircumcircle();
        return new Circle_1.Circle(this.center.clone(), this.radius);
    };
    ;
    /**
     * Check if this triangle and the passed triangle share an
     * adjacent edge.
     *
     * For edge-checking Vertex.equals is used which uses an
     * an epsilon for comparison.
     *
     * @method isAdjacent
     * @param {Triangle} tri - The second triangle to check adjacency with.
     * @return {boolean} - True if this and the passed triangle have at least one common edge.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.isAdjacent = function (tri) {
        var a = this.a.equals(tri.a) || this.a.equals(tri.b) || this.a.equals(tri.c);
        var b = this.b.equals(tri.a) || this.b.equals(tri.b) || this.b.equals(tri.c);
        var c = this.c.equals(tri.a) || this.c.equals(tri.b) || this.c.equals(tri.c);
        return (a && b) || (a && c) || (b && c);
    };
    ;
    /**
     * Get that vertex of this triangle (a,b,c) that is not vert1 nor vert2 of
     * the passed two.
     *
     * @method getThirdVertex
     * @param {Vertex} vert1 - The first vertex.
     * @param {Vertex} vert2 - The second vertex.
     * @return {Vertex} - The third vertex of this triangle that makes up the whole triangle with vert1 and vert2.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.getThirdVertex = function (vert1, vert2) {
        if (this.a.equals(vert1) && this.b.equals(vert2) || this.a.equals(vert2) && this.b.equals(vert1))
            return this.c;
        if (this.b.equals(vert1) && this.c.equals(vert2) || this.b.equals(vert2) && this.c.equals(vert1))
            return this.a;
        //if( this.c.equals(vert1) && this.a.equals(vert2) || this.c.equals(vert2) && this.a.equals(vert1) )
        return this.b;
    };
    ;
    /**
     * Re-compute the circumcircle of this triangle (if the vertices
     * have changed).
     *
     * The circumcenter and radius are stored in this.center and
     * this.radius. There is a third result: radius_squared (for internal computations).
     *
     * @method calcCircumcircle
     * @return void
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.calcCircumcircle = function () {
        // From
        //    http://www.exaflop.org/docs/cgafaq/cga1.html
        var A = this.b.x - this.a.x;
        var B = this.b.y - this.a.y;
        var C = this.c.x - this.a.x;
        var D = this.c.y - this.a.y;
        var E = A * (this.a.x + this.b.x) + B * (this.a.y + this.b.y);
        var F = C * (this.a.x + this.c.x) + D * (this.a.y + this.c.y);
        var G = 2.0 * (A * (this.c.y - this.b.y) - B * (this.c.x - this.b.x));
        var dx, dy;
        if (Math.abs(G) < Triangle.EPSILON) {
            // Collinear - find extremes and use the midpoint
            var bounds = this.bounds();
            this.center = new Vertex_1.Vertex((bounds.min.x + bounds.max.x) / 2, (bounds.min.y + bounds.max.y) / 2);
            dx = this.center.x - bounds.min.x;
            dy = this.center.y - bounds.min.y;
        }
        else {
            var cx = (D * E - B * F) / G;
            var cy = (A * F - C * E) / G;
            this.center = new Vertex_1.Vertex(cx, cy);
            dx = this.center.x - this.a.x;
            dy = this.center.y - this.a.y;
        }
        this.radius_squared = dx * dx + dy * dy;
        this.radius = Math.sqrt(this.radius_squared);
    };
    ; // END calcCircumcircle
    /**
     * Check if the passed vertex is inside this triangle's
     * circumcircle.
     *
     * @method inCircumcircle
     * @param {Vertex} v - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.inCircumcircle = function (v) {
        var dx = this.center.x - v.x;
        var dy = this.center.y - v.y;
        var dist_squared = dx * dx + dy * dy;
        return (dist_squared <= this.radius_squared);
    };
    ;
    /**
     * Get the rectangular bounds for this triangle.
     *
     * @method bounds
     * @return {Bounds} - The min/max bounds of this triangle.
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.bounds = function () {
        return new Bounds_1.Bounds(new Vertex_1.Vertex(Triangle.utils.min3(this.a.x, this.b.x, this.c.x), Triangle.utils.min3(this.a.y, this.b.y, this.c.y)), new Vertex_1.Vertex(Triangle.utils.max3(this.a.x, this.b.x, this.c.x), Triangle.utils.max3(this.a.y, this.b.y, this.c.y)));
    };
    ;
    /**
     * Convert this triangle to a polygon instance.
     *
     * Plase note that this conversion does not perform a deep clone.
     *
     * @method toPolygon
     * @return {Polygon} A new polygon representing this triangle.
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.toPolygon = function () {
        return new Polygon_1.Polygon([this.a, this.b, this.c]);
    };
    ;
    /**
     * Get the determinant of this triangle.
     *
     * @method determinant
     * @return {number} - The determinant (float).
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.determinant = function () {
        // (b.y - a.y)*(c.x - b.x) - (c.y - b.y)*(b.x - a.x);
        return (this.b.y - this.a.y) * (this.c.x - this.b.x) - (this.c.y - this.b.y) * (this.b.x - this.a.x);
    };
    ;
    /**
     * Checks if the passed vertex (p) is inside this triangle.
     *
     * Note: matrix determinants rock.
     *
     * @method containsPoint
     * @param {Vertex} p - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.containsPoint = function (p) {
        return Triangle.utils.pointIsInTriangle(p.x, p.y, this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
    };
    ;
    /**
     * Get that inner triangle which defines the maximal incircle.
     *
     * @return {Triangle} The triangle of those points in this triangle that define the incircle.
     */
    Triangle.prototype.getIncircularTriangle = function () {
        var lineA = new Line_1.Line(this.a, this.b);
        var lineB = new Line_1.Line(this.b, this.c);
        var lineC = new Line_1.Line(this.c, this.a);
        var bisector1 = geomutils_1.geomutils.nsectAngle(this.b, this.a, this.c, 2)[0]; // bisector of first angle (in b)
        var bisector2 = geomutils_1.geomutils.nsectAngle(this.c, this.b, this.a, 2)[0]; // bisector of second angle (in c)
        var intersection = bisector1.intersection(bisector2);
        // Find the closest points on one of the polygon lines (all have same distance by construction)
        var circleIntersA = lineA.getClosestPoint(intersection);
        var circleIntersB = lineB.getClosestPoint(intersection);
        var circleIntersC = lineC.getClosestPoint(intersection);
        return new Triangle(circleIntersA, circleIntersB, circleIntersC);
    };
    ;
    /**
     * Get the incircle of this triangle. That is the circle that touches each side
     * of this triangle in exactly one point.
     *
     * Note this just calls getIncircularTriangle().getCircumcircle()
     *
     * @return {Circle} The incircle of this triangle.
     */
    Triangle.prototype.getIncircle = function () {
        return this.getIncircularTriangle().getCircumcircle();
    };
    ;
    /**
     * Converts this triangle into a human-readable string.
     *
     * @method toString
     * @return {string}
     * @instance
     * @memberof Triangle
     */
    Triangle.prototype.toString = function () {
        return '{ a : ' + this.a.toString() + ', b : ' + this.b.toString() + ', c : ' + this.c.toString() + '}';
    };
    ;
    /**
     * Create an SVG representation of this triangle.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} The SVG string.
     * @instance
     * @memberof Triangle
     **/
    Triangle.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<path');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' d="');
        var vertices = [this.a, this.b, this.c];
        if (vertices.length > 0) {
            buffer.push('M ');
            buffer.push(vertices[0].x);
            buffer.push(' ');
            buffer.push(vertices[0].y);
            for (var i = 1; i < vertices.length; i++) {
                buffer.push(' L ');
                buffer.push(vertices[i].x);
                buffer.push(' ');
                buffer.push(vertices[i].y);
            }
            //if( !this.isOpen ) {
            buffer.push(' Z');
            //}
        }
        buffer.push('" />');
        return buffer.join('');
    };
    ;
    /**
     * An epsilon for comparison.
     * This should be the same epsilon as in Vertex.
     *
     * @private
     **/
    Triangle.EPSILON = 1.0e-6;
    Triangle.utils = {
        // Used in the bounds() function.
        max3: function (a, b, c) {
            return (a >= b && a >= c) ? a : (b >= a && b >= c) ? b : c;
        },
        min3: function (a, b, c) {
            return (a <= b && a <= c) ? a : (b <= a && b <= c) ? b : c;
        },
        /**
         * Used by the containsPoint() function.
         *
         * @private
         **/
        pointIsInTriangle: function (px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
            //
            // Point-in-Triangle test found at
            //   http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-2d-triangle
            //
            var area = 1 / 2 * (-p1y * p2x + p0y * (-p1x + p2x) + p0x * (p1y - p2y) + p1x * p2y);
            var s = 1 / (2 * area) * (p0y * p2x - p0x * p2y + (p2y - p0y) * px + (p0x - p2x) * py);
            var t = 1 / (2 * area) * (p0x * p1y - p0y * p1x + (p0y - p1y) * px + (p1x - p0x) * py);
            return s > 0 && t > 0 && (1 - s - t) > 0;
        }
    };
    return Triangle;
}());
exports.Triangle = Triangle;
//# sourceMappingURL=Triangle.js.map