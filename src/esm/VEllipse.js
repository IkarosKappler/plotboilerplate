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
 * @modified 2021-03-15 Added `VEllipse.quarterSegmentCount` and `VEllipse.scale` functions.
 * @modified 2021-03-19 Added the `VEllipse.rotate` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `VEllipse.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2025-03-31 ATTENTION: modified the winding direction of the `tangentAt` method to match with the Circle method. This is a breaking change!
 * @modified 2025-03-31 Adding the `VEllipse.move(amount: XYCoords)` method.
 * @version  1.4.0
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
import { Line } from "./Line";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
import { UIDGenerator } from "./UIDGenerator";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { Circle } from "./Circle";
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
        this.rotation = rotation || 0.0;
    }
    /**
     * Clone this ellipse (deep clone).
     *
     * @return {VEllipse} A copy of this ellipse.s
     */
    clone() {
        return new VEllipse(this.center.clone(), this.axis.clone(), this.rotation);
    }
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
    /**
     * Move the ellipse by the given amount. This is equivalent by moving the `center` and `axis` points.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof VEllipse
     * @return {VEllipse} this for chaining
     **/
    move(amount) {
        this.center.add(amount);
        this.axis.add(amount);
        return this;
    }
    /**
     * Scale this ellipse by the given factor from the center point. The factor will be applied to both radii.
     *
     * @method scale
     * @instance
     * @memberof VEllipse
     * @param {number} factor - The factor to scale by.
     * @return {VEllipse} this for chaining.
     */
    scale(factor) {
        this.axis.scale(factor, this.center);
        return this;
    }
    /**
     * Rotate this ellipse around its center.
     *
     * @method rotate
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to rotate by.
     * @returns {VEllipse} this for chaining.
     */
    rotate(angle) {
        this.axis.rotate(angle, this.center);
        this.rotation += angle;
        return this;
    }
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
        // return new Vertex(VEllipse.utils.polarToCartesian(this.center.x, this.center.y, a, b, angle + this.rotation));
    }
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
    normalAt(angle, length) {
        // const point: Vertex = this.vertAt(angle);
        const point = this.vertAt(angle - this.rotation); // HERE IS THE CORRECT BEHAVIOR!
        const foci = this.getFoci();
        // Calculate the angle between [point,focusA] and [point,focusB]
        const angleA = new Line(point, foci[0]).angle();
        const angleB = new Line(point, foci[1]).angle();
        const centerAngle = angleA + (angleB - angleA) / 2.0;
        const endPointA = point.clone().addX(50).clone().rotate(centerAngle, point);
        const endPointB = point
            .clone()
            .addX(50)
            .clone()
            .rotate(Math.PI + centerAngle, point);
        const resultVector = this.center.distance(endPointA) < this.center.distance(endPointB)
            ? new Vector(point, endPointB)
            : new Vector(point, endPointA);
        if (typeof length === "number") {
            resultVector.setLength(length);
        }
        return resultVector;
    }
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
    tangentAt(angle, length) {
        const normal = this.normalAt(angle, length);
        // const normal: Vector = this.normalAt(angle - this.rotation, length);
        // Rotate the normal by 90 degrees, then it is the tangent.
        // normal.b.rotate(Math.PI / 2, normal.a);
        // return normal;
        return normal.inv().perp();
    }
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
    /**
     * Get the two foci of this ellipse.
     *
     * @method getFoci
     * @instance
     * @memberof VEllipse
     * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
     */
    getFoci() {
        // https://www.mathopenref.com/ellipsefoci.html
        const rh = this.radiusH();
        const rv = this.radiusV();
        const sdiff = rh * rh - rv * rv;
        // f is the distance of each focs to the center.
        const f = Math.sqrt(Math.abs(sdiff));
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
    }
    /**
     * Get equally distributed points on the outline of this ellipse.
     *
     * @method getEquidistantVertices
     * @instance
     * @param {number} pointCount - The number of points.
     * @returns {Array<Vertex>}
     */
    getEquidistantVertices(pointCount) {
        const angles = VEllipse.utils.equidistantVertAngles(this.radiusH(), this.radiusV(), pointCount);
        const result = [];
        for (var i = 0; i < angles.length; i++) {
            result.push(this.vertAt(angles[i]));
        }
        return result;
    }
    //--- BEGIN --- Implement interface `Intersectable`
    /**
     * Get the line intersections as vectors with this ellipse.
     *
     * @method lineIntersections
     * @instance
     * @param {VertTuple<Vector> ray - The line/ray to intersect this ellipse with.
     * @param {boolean} inVectorBoundsOnly - (default=false) Set to true if only intersections within the vector bounds are of interest.
     * @returns
     */
    lineIntersections(ray, inVectorBoundsOnly = false) {
        // Question: what happens to extreme versions when ellipse is a line (width or height is zero)?
        //           This would result in a Division_by_Zero exception!
        // Step A: create clones for operations (keep originals unchanged)
        const ellipseCopy = this.clone(); // VEllipse
        const rayCopy = ray.clone(); // Vector
        // Step B: move both so ellipse's center is located at (0,0)
        const moveAmount = ellipseCopy.center.clone().inv();
        ellipseCopy.move(moveAmount);
        rayCopy.add(moveAmount);
        // Step C: rotate eclipse backwards it's rotation, so that rotation is zero (0.0).
        //         Rotate together with ray!
        const rotationAmount = -ellipseCopy.rotation;
        ellipseCopy.rotate(rotationAmount); // Rotation around (0,0) = center of translated ellipse
        rayCopy.a.rotate(rotationAmount, ellipseCopy.center);
        rayCopy.b.rotate(rotationAmount, ellipseCopy.center);
        // Step D: find x/y factors to use for scaling to transform the ellipse to a circle.
        //         Scale together with vector ray.
        const radiusH = ellipseCopy.radiusH();
        const radiusV = ellipseCopy.radiusV();
        const scalingFactors = radiusH > radiusV ? { x: radiusV / radiusH, y: 1.0 } : { x: 1.0, y: radiusH / radiusV };
        // Step E: scale ellipse AND ray by calculated factors.
        ellipseCopy.axis.scaleXY(scalingFactors);
        rayCopy.a.scaleXY(scalingFactors);
        rayCopy.b.scaleXY(scalingFactors);
        // Intermediate result: now the ellipse is transformed to a circle and we can calculate intersections :)
        // Step F: calculate circle+line intersecions
        const tmpCircle = new Circle(new Vertex(), ellipseCopy.radiusH()); // radiusH() === radiusV()
        const intersections = tmpCircle.lineIntersections(rayCopy, inVectorBoundsOnly);
        // Step G: transform intersecions back to original configuration
        intersections.forEach(function (intersectionPoint) {
            // Reverse transformation from above.
            intersectionPoint.scaleXY({ x: 1 / scalingFactors.x, y: 1 / scalingFactors.y }, ellipseCopy.center);
            intersectionPoint.rotate(-rotationAmount, ellipseCopy.center);
            intersectionPoint.sub(moveAmount);
        });
        return intersections;
    }
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    lineIntersectionTangents(line, inVectorBoundsOnly = false) {
        // Find the intersections of all lines plus their tangents inside the circle bounds
        const interSectionPoints = this.lineIntersections(line, inVectorBoundsOnly);
        return interSectionPoints.map((vert) => {
            // Calculate angle
            const lineFromCenter = new Line(this.center, vert);
            const angle = lineFromCenter.angle();
            // console.log("angle", (angle / Math.PI) * 180.0);
            // const angle = Math.random() * Math.PI * 2; // TODO
            // Calculate tangent at angle
            return this.tangentAt(angle);
        });
    }
    //--- END --- Implement interface `Intersectable`
    /**
     * Convert this ellipse into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing this ellipse.
     */
    toCubicBezier(quarterSegmentCount, threshold) {
        // Math by Luc Maisonobe
        //    http://www.spaceroots.org/documents/ellipse/node22.html
        // Note that ellipses with radiusH=0 or radiusV=0 cannot be represented as Bézier curves.
        // Return a single line here (as a Bézier curve)
        // if (Math.abs(this.radiusV()) < 0.00001) {
        //   const radiusH = this.radiusH();
        //   return [
        //     new CubicBezierCurve(
        //       this.center.clone().addX(radiusH),
        //       this.center.clone().addX(-radiusH),
        //       this.center.clone(),
        //       this.center.clone()
        //     )
        //   ]; // TODO: test horizontal line ellipse
        // }
        // if (Math.abs(this.radiusH()) < 0.00001) {
        //   const radiusV = this.radiusV();
        //   return [
        //     new CubicBezierCurve(
        //       this.center.clone().addY(radiusV),
        //       this.center.clone().addY(-radiusV),
        //       this.center.clone(),
        //       this.center.clone()
        //     )
        //   ]; // TODO: test vertical line ellipse
        // }
        // At least 4, but 16 seems to be a good value.
        const segmentCount = Math.max(1, quarterSegmentCount || 3) * 4;
        threshold = typeof threshold === "undefined" ? 0.666666 : threshold;
        const radiusH = this.radiusH();
        const radiusV = this.radiusV();
        const curves = [];
        const angles = VEllipse.utils.equidistantVertAngles(radiusH, radiusV, segmentCount);
        let curAngle = angles[0] + this.rotation;
        let startPoint = this.vertAt(curAngle);
        for (var i = 0; i < angles.length; i++) {
            let nextAngle = angles[(i + 1) % angles.length] + this.rotation;
            let endPoint = this.vertAt(nextAngle);
            if (Math.abs(radiusV) < 0.0001 || Math.abs(radiusH) < 0.0001) {
                // Distorted ellipses can only be approximated by linear Bézier segments
                let diff = startPoint.difference(endPoint);
                let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().addXY(diff.x * 0.333, diff.y * 0.333), endPoint.clone().addXY(-diff.x * 0.333, -diff.y * 0.333));
                curves.push(curve);
            }
            else {
                let startTangent = this.tangentAt(curAngle + this.rotation);
                let endTangent = this.tangentAt(nextAngle + this.rotation);
                // Find intersection (ignore that the result might be null in some extreme cases)
                let intersection = startTangent.intersection(endTangent);
                // What if intersection is undefined?
                // --> This *can* not happen if segmentCount > 2 and height and width of the ellipse are not zero.
                let startDiff = startPoint.difference(intersection);
                let endDiff = endPoint.difference(intersection);
                let curve = new CubicBezierCurve(startPoint.clone(), endPoint.clone(), startPoint.clone().add(startDiff.scale(threshold)), endPoint.clone().add(endDiff.scale(threshold)));
                curves.push(curve);
            }
            startPoint = endPoint;
            curAngle = nextAngle;
        }
        return curves;
    }
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy() {
        this.center.destroy();
        this.axis.destroy();
        this.isDestroyed = true;
    }
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
    phiToTheta: (radiusH, radiusV, phi) => {
        //  See https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc
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
    equidistantVertAngles: (radiusH, radiusV, pointCount) => {
        const angles = [];
        for (var i = 0; i < pointCount; i++) {
            var phi = Math.PI / 2.0 + ((Math.PI * 2) / pointCount) * i;
            let theta = VEllipse.utils.phiToTheta(radiusH, radiusV, phi);
            angles[i] = theta;
        }
        return angles;
    }
}; // END utils
//# sourceMappingURL=VEllipse.js.map