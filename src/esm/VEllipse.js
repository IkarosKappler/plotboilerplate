/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-04 Added the `vertAt` and `perimeter` functions.
 * @version  1.2.2
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
import { Vertex } from "./Vertex";
import { UIDGenerator } from "./UIDGenerator";
/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
export class VEllipse {
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center - The ellipses center.
     * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
     * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
     * @name VEllipse
     **/
    constructor(center, axis, rotation) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipse";
        this.uid = UIDGenerator.next();
        this.center = center;
        this.axis = axis;
        this.rotation = rotation | 0.0;
    }
    ;
    /**
     * Get the non-negative horizonal radius of this ellipse.
     *
     * @method radiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned horizontal radius of this ellipse.
     */
    radiusH() {
        return Math.abs(this.signedRadiusH());
    }
    ;
    /**
     * Get the signed horizonal radius of this ellipse.
     *
     * @method signedRadiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The signed horizontal radius of this ellipse.
     */
    signedRadiusH() {
        // return Math.abs(this.axis.x - this.center.x);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x);
        return new Vertex(this.axis).rotate(-this.rotation, this.center).x - this.center.x;
    }
    ;
    /**
     * Get the non-negative vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned vertical radius of this ellipse.
     */
    radiusV() {
        return Math.abs(this.signedRadiusV());
    }
    ;
    /**
     * Get the signed vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The signed vertical radius of this ellipse.
     */
    signedRadiusV() {
        // return Math.abs(this.axis.y - this.center.y);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y);
        return new Vertex(this.axis).rotate(-this.rotation, this.center).y - this.center.y;
    }
    ;
    /**
     * Get the vertex on the ellipse's outline at the given angle.
     *
     * @method vertAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to determine the vertex at.
     * @return {Vertex} The vertex on the outline at the given angle.
     */
    vertAt(angle) {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        const a = this.radiusH();
        const b = this.radiusV();
        return new Vertex(VEllipse.utils.polarToCartesian(this.center.x, this.center.y, a, b, angle)).rotate(this.rotation, this.center);
    }
    ;
    /**
     * Get the perimeter of this ellipse.
     *
     * @method perimeter
     * @instance
     * @memberof VEllipse
     * @return {number}
     */
    perimeter() {
        // This method does not use an iterative approximation to determine the perimeter, but it uses
        // a wonderful closed approximation found by Srinivasa Ramanujan.
        // Matt Parker made a neat video about it:
        //    https://www.youtube.com/watch?v=5nW3nJhBHL0
        const a = this.radiusH();
        const b = this.radiusV();
        return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    }
    ;
    /**
     * Create an SVG representation of this ellipse.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @param {object} options { className?:string }
     * @return string The SVG string
     */
    toSVGString(options) {
        options = options || {};
        var buffer = [];
        buffer.push('<ellipse');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.center.x + '"');
        buffer.push(' cy="' + this.center.y + '"');
        buffer.push(' rx="' + this.axis.x + '"');
        buffer.push(' ry="' + this.axis.y + '"');
        buffer.push(' />');
        return buffer.join('');
    }
    ;
}
/**
 * A static collection of ellipse-related helper functions.
 * @static
 */
VEllipse.utils = {
    /**
     * Calculate a particular point on the outline of the given ellipse (center plus two radii plus angle).
     *
     * @name polarToCartesian
     * @param {number} centerX - The x coordinate of the elliptic center.
     * @param {number} centerY - The y coordinate of the elliptic center.
     * @param {number} radiusH - The horizontal radius of the ellipse.
     * @param {number} radiusV - The vertical radius of the ellipse.
     * @param {number} angle - The angle (in radians) to get the desired outline point for.
     * @reutn {XYCoords} The outlont point in absolute x-y-coordinates.
     */
    polarToCartesian: (centerX, centerY, radiusH, radiusV, angle) => {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        var s = Math.sin(Math.PI / 2 - angle);
        var c = Math.cos(Math.PI / 2 - angle);
        return { x: centerX + radiusH * radiusV * s / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2)),
            y: centerY + radiusH * radiusV * c / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2))
        };
    }
}; // END utils
;
//# sourceMappingURL=VEllipse.js.map