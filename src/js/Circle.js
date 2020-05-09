"use strict";
/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Vertex, SVGSerializale
 *
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 *
 * @file Circle
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var Circle = /** @class */ (function () {
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    function Circle(center, radius) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Circle";
        this.center = center;
        this.radius = radius;
    }
    ;
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
    Circle.prototype.lineDistance = function (line) {
        var closestPointOnLine = line.getClosestPoint(this.center);
        return closestPointOnLine.distance(this.center) - this.radius;
    };
    ;
    /**
      * Create an SVG representation of this circle.
      *
      * @param {object} options { className?:string }
      * @return string The SVG string
      */
    Circle.prototype.toSVGString = function (options) {
        options = options || {};
        var buffer = [];
        buffer.push('<circle');
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.center.x + '"');
        buffer.push(' cy="' + this.center.y + '"');
        buffer.push(' r="' + this.radius + '"');
        buffer.push(' />');
        return buffer.join('');
    };
    ;
    return Circle;
}()); // END class
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map