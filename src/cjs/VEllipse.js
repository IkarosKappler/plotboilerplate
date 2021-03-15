"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-03 Added the `vertAt` and `perimeter` methods.
 * @modified 2021-03-05 Added the `getFoci`, `normalAt` and `tangentAt` methods.
 * @modified 2021-03-09 Added the `clone` and `rotate` methods.
 * @modified 2021-03-10 Added the `toCubicBezier` method.
 * @version  1.2.2
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEllipse = void 0;
var Line_1 = require("./Line");
var Vector_1 = require("./Vector");
var Vertex_1 = require("./Vertex");
var UIDGenerator_1 = require("./UIDGenerator");
var CubicBezierCurve_1 = require("./CubicBezierCurve");
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
     * @param {Vertex} center - The ellipses center.
     * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
     * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
     * @name VEllipse
     **/
    function VEllipse(center, axis, rotation) {
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "VEllipse";
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.center = center;
        this.axis = axis;
        this.rotation = rotation | 0.0;
    }
    /**
     * Clone this ellipse (deep clone).
     *
     * @return {VEllipse} A copy of this ellipse.s
     */
    VEllipse.prototype.clone = function () {
        return new VEllipse(this.center.clone(), this.axis.clone(), this.rotation);
    };
    /**
     * Get the non-negative horizonal radius of this ellipse.
     *
     * @method radiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned horizontal radius of this ellipse.
     */
    VEllipse.prototype.radiusH = function () {
        return Math.abs(this.signedRadiusH());
    };
    /**
     * Get the signed horizonal radius of this ellipse.
     *
     * @method signedRadiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The signed horizontal radius of this ellipse.
     */
    VEllipse.prototype.signedRadiusH = function () {
        // return Math.abs(this.axis.x - this.center.x);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x);
        return new Vertex_1.Vertex(this.axis).rotate(-this.rotation, this.center).x - this.center.x;
    };
    /**
     * Get the non-negative vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned vertical radius of this ellipse.
     */
    VEllipse.prototype.radiusV = function () {
        return Math.abs(this.signedRadiusV());
    };
    /**
     * Get the signed vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The signed vertical radius of this ellipse.
     */
    VEllipse.prototype.signedRadiusV = function () {
        // return Math.abs(this.axis.y - this.center.y);
        // Rotate axis back to origin before calculating radius
        // return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y);
        return new Vertex_1.Vertex(this.axis).rotate(-this.rotation, this.center).y - this.center.y;
    };
    /**
     * Get the vertex on the ellipse's outline at the given angle.
     *
     * @method vertAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to determine the vertex at.
     * @return {Vertex} The vertex on the outline at the given angle.
     */
    VEllipse.prototype.vertAt = function (angle) {
        // Tanks to Narasinham for the vertex-on-ellipse equations
        // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
        var a = this.radiusH();
        var b = this.radiusV();
        return new Vertex_1.Vertex(VEllipse.utils.polarToCartesian(this.center.x, this.center.y, a, b, angle)).rotate(this.rotation, this.center);
    };
    /**
     * Get the normal vector at the given angle.
     * The normal vector is the vector that intersects the ellipse in a 90 degree angle
     * at the given point (speicified by the given angle).
     *
     * Length of desired normal vector can be specified, default is 1.0.
     *
     * @method normalAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the normal vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    VEllipse.prototype.normalAt = function (angle, length) {
        var point = this.vertAt(angle);
        var foci = this.getFoci();
        // Calculate the angle between [point,focusA] and [point,focusB]
        var angleA = new Line_1.Line(point, foci[0]).angle();
        var angleB = new Line_1.Line(point, foci[1]).angle();
        var centerAngle = angleA + (angleB - angleA) / 2.0;
        var endPointA = point.clone().addX(50).clone().rotate(centerAngle, point);
        var endPointB = point
            .clone()
            .addX(50)
            .clone()
            .rotate(Math.PI + centerAngle, point);
        if (this.center.distance(endPointA) < this.center.distance(endPointB)) {
            return new Vector_1.Vector(point, endPointB);
        }
        else {
            return new Vector_1.Vector(point, endPointA);
        }
    };
    /**
     * Get the tangent vector at the given angle.
     * The tangent vector is the vector that touches the ellipse exactly at the given given
     * point (speicified by the given angle).
     *
     * Note that the tangent is just 90 degree rotated normal vector.
     *
     * Length of desired tangent vector can be specified, default is 1.0.
     *
     * @method tangentAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the tangent vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    VEllipse.prototype.tangentAt = function (angle, length) {
        var normal = this.normalAt(angle, length);
        // Rotate the normal by 90 degrees, then it is the tangent.
        normal.b.rotate(Math.PI / 2, normal.a);
        return normal;
    };
    /**
     * Get the slope of the
     * @param angle
     * @returns
     */
    //   slopeAt(angle:number) : number {
    //     return (this.radiusH() * Math.sin(angle)) / (this.radiusV() * Math.cos(angle));
    //   }
    /**
     * Get the perimeter of this ellipse.
     *
     * @method perimeter
     * @instance
     * @memberof VEllipse
     * @return {number}
     */
    VEllipse.prototype.perimeter = function () {
        // This method does not use an iterative approximation to determine the perimeter, but it uses
        // a wonderful closed approximation found by Srinivasa Ramanujan.
        // Matt Parker made a neat video about it:
        //    https://www.youtube.com/watch?v=5nW3nJhBHL0
        var a = this.radiusH();
        var b = this.radiusV();
        return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    };
    /**
     * Get the two foci of this ellipse.
     *
     * @method getFoci
     * @instance
     * @memberof VEllipse
     * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
     */
    VEllipse.prototype.getFoci = function () {
        // https://www.mathopenref.com/ellipsefoci.html
        var rh = this.radiusH();
        var rv = this.radiusV();
        var sdiff = rh * rh - rv * rv;
        // f is the distance of each focs to the center.
        var f = Math.sqrt(Math.abs(sdiff));
        // Foci on x- or y-axis?
        if (sdiff < 0) {
            return [
                this.center.clone().addY(f).rotate(this.rotation, this.center),
                this.center.clone().addY(-f).rotate(this.rotation, this.center)
            ];
        }
        else {
            return [
                this.center.clone().addX(f).rotate(this.rotation, this.center),
                this.center.clone().addX(-f).rotate(this.rotation, this.center)
            ];
        }
    };
    /**
     * Get n equidistant points on the elliptic arc.
     *
     * @param pointCount
     * @returns
     */
    // getEquidistantVertices(pointCount: number): Array<Vertex> {
    //   // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
    //   var a = this.radiusH();
    //   var b = this.radiusV();
    //   var vertices = [];
    //   for (var i = 0; i < pointCount; i++) {
    //     var phi = Math.PI / 2.0 + ((Math.PI * 2) / pointCount) * i;
    //     // var tanPhi = Math.tan(phi);
    //     // var tanPhi2 = tanPhi * tanPhi;
    //     // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
    //     let theta = VEllipse.utils.phiToTheta(a, b, phi);
    //     vertices[i] = this.vertAt(theta);
    //   }
    //   return vertices;
    // }
    // getEquilateralSectors(sectorCount: number): Array<number> {
    //   // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
    //   var a = this.radiusH();
    //   var b = this.radiusV();
    //   var sectorAngles = [];
    //   for (var i = 0; i < sectorCount; i++) {
    //     var phi = Math.PI / 2.0 + ((Math.PI * 2) / sectorCount) * i;
    //     // var tanPhi = Math.tan(phi);
    //     // var tanPhi2 = tanPhi * tanPhi;
    //     // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
    //     var theta = VEllipse.utils.phiToTheta(a, b, phi);
    //     // vertices[i] = this.vertAt(theta);
    //     sectorAngles[i] = theta;
    //   }
    //   return sectorAngles;
    // }
    // getEquidistantVertices(pointCount: number, startAngle?: number, endAngle?: number, addEndPoint?: boolean): Array<Vertex> {
    //   // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
    //   // var pointCount = config.bezierSegments;
    //   // var startAngle = ellipseSector.startAngle;
    //   // var endAngle = ellipseSector.endAngle;
    //   startAngle = typeof startAngle === "undefined" ? 0 : startAngle;
    //   endAngle = typeof endAngle === "undefined" ? 0 : endAngle;
    //   var a = this.radiusH();
    //   var b = this.radiusV();
    //   // var fullAngle = Math.PI * 2;
    //   var fullAngle = endAngle - startAngle; // Math.PI*2
    //   if (fullAngle < 0) {
    //     fullAngle = Math.PI * 2 + fullAngle;
    //   }
    //   var vertices = [];
    //   for (var i = 0; i < pointCount + (addEndPoint ? 1 : 0); i++) {
    //     // var phi = Math.PI / 2.0 + startAngle + (fullAngle / pointCount) * i;
    //     var phi = Math.PI / 2.0 + (fullAngle / pointCount) * i;
    //     var tanPhi = Math.tan(phi);
    //     var tanPhi2 = tanPhi * tanPhi;
    //     // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
    //     // var theta = startAngle - Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
    //     var theta = startAngle - Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
    //     vertices[i] = this.vertAt(theta);
    //     // pb.draw.circleHandle(vertices[i], 5, "orange");
    //     // pb.draw.line(this.center, vertices[i], "grey", 1);
    //   }
    //   // Add the last vertice if not full circle
    //   // if( fullAngle < Math.PI*2 )
    //   // vertices.push[]
    //   return vertices;
    // }
    //   rotate(angle: number) {
    //     this.axis.rotate(angle, this.center);
    //     this.rotation += angle;
    //   }
    /**
     *
     * @param {number} quarterSegmentCount - The desired segment count (should be a nultiple of 4, but at least 4).
     * @param threshold
     * @returns
     */
    VEllipse.prototype.toCubicBezier = function (quarterSegmentCount, threshold) {
        // Math by Luc Maisonobe
        //    http://www.spaceroots.org/documents/ellipse/node22.html
        // Note that ellipses with radiusH=0 or radiusV=0 cannot be represented as Bézier curves.
        // Return a single line here (as a Bézier curve)
        if (Math.abs(this.radiusV()) < 0.00001) {
            var radiusH_1 = this.radiusH();
            return [
                new CubicBezierCurve_1.CubicBezierCurve(this.center.clone().addX(radiusH_1), this.center.clone().addX(-radiusH_1), this.center.clone(), this.center.clone())
            ]; // TODO: test horizontal line ellipse
        }
        if (Math.abs(this.radiusH()) < 0.00001) {
            var radiusV_1 = this.radiusV();
            return [
                new CubicBezierCurve_1.CubicBezierCurve(this.center.clone().addY(radiusV_1), this.center.clone().addY(-radiusV_1), this.center.clone(), this.center.clone())
            ]; // TODO: test vertical line ellipse
        }
        var segmentCount = Math.max(1, quarterSegmentCount || 3) * 4; // At least 4, but 16 seems to be a good value.
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        var radiusH = this.radiusH();
        var radiusV = this.radiusV();
        // let curAngle: number = 0;
        var curves = [];
        var angles = VEllipse.utils.equidistantVertAngles(radiusH, radiusV, segmentCount);
        var curAngle = angles[0];
        var startPoint = this.vertAt(curAngle);
        //let lastIntersection: Vertex | undefined;
        // for (var i = 0; i < segmentCount; i++) {
        for (var i = 0; i < angles.length; i++) {
            // let nextAngle: number = ((Math.PI * 2) / segmentCount) * (i + 1);
            // let nextAngle: number = VEllipse.utils.phiToTheta(radiusH, radiusV, Math.PI / 2.0 + ((Math.PI * 2) / segmentCount) * i);
            // let curAngle: number = angles[i];
            var nextAngle = angles[(i + 1) % angles.length];
            var endPoint = this.vertAt(nextAngle);
            var startTangent = this.tangentAt(curAngle);
            var endTangent = this.tangentAt(nextAngle);
            // Find intersection
            var intersection = startTangent.intersection(endTangent);
            // What if intersection is undefined?
            // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
            var startDiff = startPoint.difference(intersection);
            var endDiff = endPoint.difference(intersection);
            var curve = new CubicBezierCurve_1.CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
            curves.push(curve);
            startPoint = endPoint;
            curAngle = nextAngle;
            //lastIntersection = intersection;
        }
        return curves;
    };
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
        buffer.push("<ellipse");
        if (options.className)
            buffer.push(' class="' + options.className + '"');
        buffer.push(' cx="' + this.center.x + '"');
        buffer.push(' cy="' + this.center.y + '"');
        buffer.push(' rx="' + this.axis.x + '"');
        buffer.push(' ry="' + this.axis.y + '"');
        buffer.push(" />");
        return buffer.join("");
    };
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
        polarToCartesian: function (centerX, centerY, radiusH, radiusV, angle) {
            // Tanks to Narasinham for the vertex-on-ellipse equations
            // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
            var s = Math.sin(Math.PI / 2 - angle);
            var c = Math.cos(Math.PI / 2 - angle);
            return {
                x: centerX + (radiusH * radiusV * s) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2)),
                y: centerY + (radiusH * radiusV * c) / Math.sqrt(Math.pow(radiusH * c, 2) + Math.pow(radiusV * s, 2))
            };
        },
        /**
         * Get the `theta` for a given `phi` (used to determine equidistant points on ellipse).
         *
         * @param radiusH
         * @param radiusV
         * @param phi
         * @returns {number} theta
         */
        phiToTheta: function (radiusH, radiusV, phi) {
            //  See https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
            // var phi = Math.PI / 2.0 + ((Math.PI * 2) / sectorCount) * i;
            var tanPhi = Math.tan(phi);
            var tanPhi2 = tanPhi * tanPhi;
            var theta = -Math.PI / 2 + phi + Math.atan(((radiusH - radiusV) * tanPhi) / (radiusV + radiusH * tanPhi2));
            return theta;
        },
        /**
         * Get n equidistant points on the elliptic arc.
         *
         * @param pointCount
         * @returns
         */
        equidistantVertAngles: function (radiusH, radiusV, pointCount) {
            // var a = this.radiusH();
            // var b = this.radiusV();
            var angles = [];
            for (var i = 0; i < pointCount; i++) {
                var phi = Math.PI / 2.0 + ((Math.PI * 2) / pointCount) * i;
                // var tanPhi = Math.tan(phi);
                // var tanPhi2 = tanPhi * tanPhi;
                // var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));
                var theta = VEllipse.utils.phiToTheta(radiusH, radiusV, phi);
                // vertices[i] = this.vertAt(theta);
                angles[i] = theta;
            }
            return angles; // vertices;
        }
    }; // END utils
    return VEllipse;
}());
exports.VEllipse = VEllipse;
//# sourceMappingURL=VEllipse.js.map