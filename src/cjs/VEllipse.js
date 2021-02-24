"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @version  1.1.0
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipse = void 0;
var Vertex_1 = require("./Vertex");
var UIDGenerator_1 = require("./UIDGenerator");
/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
var VEllipse = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    function VEllipse(center, axis) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipse";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.center = center;
        this.axis = axis;
    }
    ;
    VEllipse.prototype.radiusH = function () {
        return this.axis.x - this.center.x;
    };
    ;
    VEllipse.prototype.radiusV = function () {
        return this.axis.y - this.center.y;
    };
    ;
    VEllipse.prototype._vertAt = function (angle) {
        return new Vertex_1.Vertex(this.center.x + this.radiusH() * Math.cos(angle), this.center.y + this.radiusV() * Math.sin(angle));
    };
    ;
    VEllipse.prototype.vertAt = function (angle) {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        var a = this.radiusV();
        var b = this.radiusH();
        var s = Math.sin(Math.PI / 2 - angle);
        var c = Math.cos(Math.PI / 2 - angle);
        return new Vertex_1.Vertex(a * b * s / Math.sqrt(Math.pow(b * c, 2) + Math.pow(a * s, 2)), a * b * c / Math.sqrt(Math.pow(b * c, 2) + Math.pow(a * s, 2))).add(this.center);
    };
    ;
    /**
     * Create an SVG representation of this ellipse.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @param {object} options { className?:string }
     * @return string The SVG string
     */
    VEllipse.prototype.toSVGString = function (options) {
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
    };
    ;
    return VEllipse;
}());
exports.VEllipse = VEllipse;
//# sourceMappingURL=VEllipse.js.map